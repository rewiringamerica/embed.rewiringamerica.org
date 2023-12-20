import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { program } from 'commander';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import * as fs from 'fs';
import * as path from 'path';

function getOneTagOrThrow(node: Element | Document, tagName: string): Element {
  const tags = node.getElementsByTagName(tagName);
  if (tags.length !== 1) {
    throw new Error(`Expected one ${tagName} element; got ${tags.length}`);
  }
  return tags[0];
}

function getOneTagOrNull(
  node: Element | Document,
  tagName: string,
): Element | null {
  const tags = node.getElementsByTagName(tagName);
  return tags.length !== 1 ? null : tags[0];
}

function parseLocaleFile(locale: string): Document {
  const filepath = path.join(__dirname, `../translations/${locale}.xlf`);
  const contents = fs.readFileSync(filepath, 'utf-8');
  return new DOMParser().parseFromString(contents);
}

function writeLocaleFile(locale: string, doc: Document) {
  fs.writeFileSync(
    path.join(__dirname, `../translations/${locale}.xlf`),
    new XMLSerializer().serializeToString(doc),
  );
}

/**
 * Converts a <source> or <target> node from XLIFF into a plain string suitable
 * for our CSV schema. Placeholders are brace-enclosed, starting with the
 * placeholder ID, followed by ' : ', followed by the equiv-text. So:
 *   <x id="1" equiv-text="name" />
 * becomes
 *   {1 : name}
 */
function xliffStringToCsv(node: Node): string {
  const parts: string[] = [];

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes.item(i)! as Element;
    if (child.nodeType === node.TEXT_NODE) {
      parts.push(child.nodeValue ?? '');
    } else if (child.nodeType === node.ELEMENT_NODE) {
      if (child.nodeName === 'x') {
        const id = child.getAttribute('id')!;

        // lit-localize puts the JS placeholder as equiv-text, like `${stuff}`.
        // Remove the `${ }` delimiters to reduce visual noise.
        const equivText = child.getAttribute('equiv-text')?.slice(2, -1) ?? '';
        parts.push(`{${id} : ${equivText}}`);
      } else {
        throw new Error(
          `Unexpected node in <source> or <target>: ${child.nodeName}`,
        );
      }
    }
  }

  return parts.join('');
}

/**
 * Converts strings from a CSV file, with placeholders in the format created by
 * {@link xliffStringToCsv}, back into a <target> XML node.
 */
function csvToXliffTarget(csvString: string, doc: Document): Node {
  const node = doc.createElement('target');
  const parts = csvString.split(/\{([^}]+)\}/);

  // The parts are alternating split parts and captures from the regex above
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      node.appendChild(doc.createTextNode(parts[i]));
    } else {
      const [id, equivText] = parts[i].split(':', 2);
      const placeholder = doc.createElement('x');
      placeholder.setAttribute('id', id.trim());
      placeholder.setAttribute('equiv-text', `\${${equivText.trim()}}`);
      node.appendChild(placeholder);
    }
  }

  return node;
}

/**
 * Parses the XLIFF file for the given locale, and returns XLIFF data containing
 * the first N strings from that file that don't have a <target> node.
 *
 * This is for use in the LLM workflow. ChatGPT, at least, seems to perform
 * best when given XLIFF, and the entire XLIFF file in this project is too big
 * for its token window.
 *
 * The resulting translations can be merged back together with
 * {@link mergeXliff}.
 */
function firstNUntranslated(locale: string, n: number): string {
  const document = parseLocaleFile(locale);
  const body = getOneTagOrThrow(document, 'body');

  // This is a collection that updates live, so it gets shorter as we remove
  // elements from the document
  const units = body.getElementsByTagName('trans-unit');

  // Remove all units that have a <target> already
  for (let i = 0; i < units.length; i++) {
    const unit = units.item(i)!;
    const targets = unit.getElementsByTagName('target');
    if (targets.length > 0) {
      body.removeChild(unit);
      i--;
    }
  }

  // Truncate to desired length
  while (units.length > n) {
    const unit = units.item(units.length - 1)!;
    body.removeChild(unit);
  }

  // Removing nodes will leave a bunch of blank lines; condense multiple
  // consecutive newlines down to one
  return new XMLSerializer().serializeToString(document).replace(/\n+/g, '\n');
}

/**
 * Merges translations given in XLIFF format (the "delta") into the given
 * locale's XLIFF file.
 *
 * The <target> from each <trans-unit> in the delta is added to the <trans-unit>
 * in the main file that has the same "id" attribute.
 *
 * The modified main file is written back to the same path.
 */
function mergeXliff(locale: string, deltaXliffData: string) {
  const mainDocument = parseLocaleFile(locale);
  const deltaDocument = new DOMParser().parseFromString(deltaXliffData);

  const deltaUnits = deltaDocument.getElementsByTagName('trans-unit');
  for (let i = 0; i < deltaUnits.length; i++) {
    const deltaUnit = deltaUnits.item(i)!;
    const deltaTarget = getOneTagOrNull(deltaUnit, 'target');
    if (deltaTarget !== null) {
      const id = deltaUnit.getAttribute('id')!;
      const mainUnit = mainDocument.getElementById(id);
      if (mainUnit) {
        const existingTarget = getOneTagOrNull(mainUnit, 'target');
        if (existingTarget) {
          mainUnit.removeChild(existingTarget);
        }
        mainUnit?.appendChild(deltaTarget);
      } else {
        console.warn(`Ignoring translation ${id}; not in main file`);
      }
    }
  }

  writeLocaleFile(locale, mainDocument);
}

/**
 * Convert the XLIFF file for the given locale into equivalent CSV. Placeholders
 * are converted into brace-delimited form by {@link xliffStringToCsv}.
 */
function xliffToCsv(locale: string): string {
  const document = parseLocaleFile(locale);

  const units = document.getElementsByTagName('trans-unit');
  const rows: string[][] = [['id', 'en', 'context info', locale]];

  for (let i = 0; i < units.length; i++) {
    const unit = units.item(i)!;
    const target = getOneTagOrNull(unit, 'target');
    rows.push([
      unit.getAttribute('id')!,
      xliffStringToCsv(getOneTagOrThrow(unit, 'source')),
      getOneTagOrNull(unit, 'note')?.textContent ?? '',
      target ? xliffStringToCsv(target) : '',
    ]);
  }

  return stringify(rows);
}

/**
 * Merges translations given in CSV format (the same as that output by
 * {@link xliffToCsv}) into the XLIFF file for the given locale.
 *
 * The translated string in each row, if nonempty, will be added as the <target>
 * node in the <trans-unit> with the corresponding ID.
 *
 * The modified locale file is written back to the same path.
 */
function mergeCsv(locale: string, csvData: string) {
  const mainDocument = parseLocaleFile(locale);
  const rows: Record<string, string>[] = parse(csvData, { columns: true });

  rows
    .filter(row => row[locale].trim().length > 0) // Ignore empty translations
    .forEach(row => {
      const mainUnit = mainDocument.getElementById(row.id);
      if (mainUnit) {
        const existingTarget = getOneTagOrNull(mainUnit, 'target');
        if (existingTarget) {
          mainUnit.removeChild(existingTarget);
        }
        mainUnit.appendChild(csvToXliffTarget(row[locale], mainDocument));
      } else {
        console.warn(`Ignoring translation ${row.id}; not in main file`);
      }
    });

  writeLocaleFile(locale, mainDocument);
}

function main() {
  program.description(
    'Supports workflows for translating user-visible strings.',
  );

  program
    .command('extract-xliff')
    .description(
      'Outputs an XLIFF file, containing at most N (default 50) untranslated ' +
        'strings, to stdout.',
    )
    .argument('<locale>', 'locale code to extract')
    .option('-n, --number <number>', 'max number of strings to include')
    .action((locale, opts) => {
      process.stdout.write(firstNUntranslated(locale, opts.number ?? 50));
    });
  program
    .command('merge-xliff')
    .description('Merges in translations from XLIFF given on stdin')
    .argument('<locale>', 'locale code to merge into')
    .action(locale => {
      mergeXliff(locale, fs.readFileSync(process.stdin.fd, 'utf-8'));
    });
  program
    .command('extract-csv')
    .description('Outputs CSV equivalent to the given XLIFF file, on stdout')
    .argument('<locale>', 'locale code to convert from')
    .action(locale => {
      process.stdout.write(xliffToCsv(locale));
    });
  program
    .command('merge-csv')
    .description('Merges in translations from CSV given on stdin')
    .argument('<locale>', 'locale code to merge into')
    .action(locale => {
      mergeCsv(locale, fs.readFileSync(process.stdin.fd, 'utf-8'));
    });

  program.parse();
}

main();
