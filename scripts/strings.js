'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var xmldom_1 = require('@xmldom/xmldom');
var commander_1 = require('commander');
var sync_1 = require('csv-parse/sync');
var sync_2 = require('csv-stringify/sync');
var fs = require('fs');
var path = require('path');
function getOneTagOrThrow(node, tagName) {
  var tags = node.getElementsByTagName(tagName);
  if (tags.length !== 1) {
    throw new Error(
      'Expected one '.concat(tagName, ' element; got ').concat(tags.length),
    );
  }
  return tags[0];
}
function getOneTagOrNull(node, tagName) {
  var tags = node.getElementsByTagName(tagName);
  return tags.length !== 1 ? null : tags[0];
}
function parseLocaleFile(locale) {
  var filepath = path.join(
    __dirname,
    '../translations/'.concat(locale, '.xlf'),
  );
  var contents = fs.readFileSync(filepath, 'utf-8');
  return new xmldom_1.DOMParser().parseFromString(contents);
}
function writeLocaleFile(locale, doc) {
  fs.writeFileSync(
    path.join(__dirname, '../translations/'.concat(locale, '.xlf')),
    new xmldom_1.XMLSerializer().serializeToString(doc),
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
function xliffStringToCsv(node) {
  var _a, _b, _c;
  var parts = [];
  for (var i = 0; i < node.childNodes.length; i++) {
    var child = node.childNodes.item(i);
    if (child.nodeType === node.TEXT_NODE) {
      parts.push((_a = child.nodeValue) !== null && _a !== void 0 ? _a : '');
    } else if (child.nodeType === node.ELEMENT_NODE) {
      if (child.nodeName === 'x') {
        var id = child.getAttribute('id');
        // lit-localize puts the JS placeholder as equiv-text, like `${stuff}`.
        // Remove the `${ }` delimiters to reduce visual noise.
        var equivText =
          (_c =
            (_b = child.getAttribute('equiv-text')) === null || _b === void 0
              ? void 0
              : _b.slice(2, -1)) !== null && _c !== void 0
            ? _c
            : '';
        parts.push('{'.concat(id, ' : ').concat(equivText, '}'));
      } else {
        throw new Error(
          'Unexpected node in <source> or <target>: '.concat(child.nodeName),
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
function csvToXliffTarget(csvString, doc) {
  var node = doc.createElement('target');
  var parts = csvString.split(/\{([^}]+)\}/);
  // The parts are alternating split parts and captures from the regex above
  for (var i = 0; i < parts.length; i++) {
    if (i % 2 === 0) {
      node.appendChild(doc.createTextNode(parts[i]));
    } else {
      var _a = parts[i].split(':', 2),
        id = _a[0],
        equivText = _a[1];
      var placeholder = doc.createElement('x');
      placeholder.setAttribute('id', id.trim());
      placeholder.setAttribute(
        'equiv-text',
        '${'.concat(equivText.trim(), '}'),
      );
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
function firstNUntranslated(locale, n) {
  var document = parseLocaleFile(locale);
  var body = getOneTagOrThrow(document, 'body');
  // This is a collection that updates live, so it gets shorter as we remove
  // elements from the document
  var units = body.getElementsByTagName('trans-unit');
  // Remove all units that have a <target> already
  for (var i = 0; i < units.length; i++) {
    var unit = units.item(i);
    var targets = unit.getElementsByTagName('target');
    if (targets.length > 0) {
      body.removeChild(unit);
      i--;
    }
  }
  // Truncate to desired length
  while (units.length > n) {
    var unit = units.item(units.length - 1);
    body.removeChild(unit);
  }
  // Removing nodes will leave a bunch of blank lines; condense multiple
  // consecutive newlines down to one
  return new xmldom_1.XMLSerializer()
    .serializeToString(document)
    .replace(/\n+/g, '\n');
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
function mergeXliff(locale, deltaXliffData) {
  var mainDocument = parseLocaleFile(locale);
  var deltaDocument = new xmldom_1.DOMParser().parseFromString(deltaXliffData);
  var deltaUnits = deltaDocument.getElementsByTagName('trans-unit');
  for (var i = 0; i < deltaUnits.length; i++) {
    var deltaUnit = deltaUnits.item(i);
    var deltaTarget = getOneTagOrNull(deltaUnit, 'target');
    if (deltaTarget !== null) {
      var id = deltaUnit.getAttribute('id');
      var mainUnit = mainDocument.getElementById(id);
      if (mainUnit) {
        var existingTarget = getOneTagOrNull(mainUnit, 'target');
        if (existingTarget) {
          mainUnit.removeChild(existingTarget);
        }
        mainUnit === null || mainUnit === void 0
          ? void 0
          : mainUnit.appendChild(deltaTarget);
      } else {
        console.warn('Ignoring translation '.concat(id, '; not in main file'));
      }
    }
  }
  writeLocaleFile(locale, mainDocument);
}
/**
 * Convert the XLIFF file for the given locale into equivalent CSV. Placeholders
 * are converted into brace-delimited form by {@link xliffStringToCsv}.
 */
function xliffToCsv(locale) {
  var _a, _b;
  var document = parseLocaleFile(locale);
  var units = document.getElementsByTagName('trans-unit');
  var rows = [['id', 'en', 'context info', locale]];
  for (var i = 0; i < units.length; i++) {
    var unit = units.item(i);
    var target = getOneTagOrNull(unit, 'target');
    rows.push([
      unit.getAttribute('id'),
      xliffStringToCsv(getOneTagOrThrow(unit, 'source')),
      (_b =
        (_a = getOneTagOrNull(unit, 'note')) === null || _a === void 0
          ? void 0
          : _a.textContent) !== null && _b !== void 0
        ? _b
        : '',
      target ? xliffStringToCsv(target) : '',
    ]);
  }
  return (0, sync_2.stringify)(rows);
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
function mergeCsv(locale, csvData) {
  var mainDocument = parseLocaleFile(locale);
  var rows = (0, sync_1.parse)(csvData, { columns: true });
  rows
    .filter(function (row) {
      return row[locale].trim().length > 0;
    }) // Ignore empty translations
    .forEach(function (row) {
      var mainUnit = mainDocument.getElementById(row.id);
      if (mainUnit) {
        var existingTarget = getOneTagOrNull(mainUnit, 'target');
        if (existingTarget) {
          mainUnit.removeChild(existingTarget);
        }
        mainUnit.appendChild(csvToXliffTarget(row[locale], mainDocument));
      } else {
        console.warn(
          'Ignoring translation '.concat(row.id, '; not in main file'),
        );
      }
    });
  writeLocaleFile(locale, mainDocument);
}
function main() {
  commander_1.program.description(
    'Supports workflows for translating user-visible strings.',
  );
  commander_1.program
    .command('extract-xliff')
    .description(
      'Outputs an XLIFF file, containing at most N (default 50) untranslated ' +
        'strings, to stdout.',
    )
    .argument('<locale>', 'locale code to extract')
    .option('-n, --number <number>', 'max number of strings to include')
    .action(function (locale, opts) {
      var _a;
      process.stdout.write(
        firstNUntranslated(
          locale,
          (_a = opts.number) !== null && _a !== void 0 ? _a : 50,
        ),
      );
    });
  commander_1.program
    .command('merge-xliff')
    .description('Merges in translations from XLIFF given on stdin')
    .argument('<locale>', 'locale code to merge into')
    .action(function (locale) {
      mergeXliff(locale, fs.readFileSync(process.stdin.fd, 'utf-8'));
    });
  commander_1.program
    .command('extract-csv')
    .description('Outputs CSV equivalent to the given XLIFF file, on stdout')
    .argument('<locale>', 'locale code to convert from')
    .action(function (locale) {
      process.stdout.write(xliffToCsv(locale));
    });
  commander_1.program
    .command('merge-csv')
    .description('Merges in translations from CSV given on stdin')
    .argument('<locale>', 'locale code to merge into')
    .action(function (locale) {
      mergeCsv(locale, fs.readFileSync(process.stdin.fd, 'utf-8'));
    });
  commander_1.program.parse();
}
main();
