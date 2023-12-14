import { Resolver } from '@parcel/plugin';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

async function allXlfFiles(projectRoot) {
  const entries = await promisify(fs.readdir)(
    path.join(projectRoot, 'translations'),
  );
  return entries.map(entry => path.join(projectRoot, 'translations', entry));
}

/**
 * Resolves import specifiers starting with `locales:` by running lit-localize
 * to generate strings files, and pointing Parcel at the generated files.
 *
 * The generated files are in Parcel's cache directory (configured in
 * lit-localize.json) so that they don't trigger Parcel's watcher, which could
 * result in an infinite loop of rebuilding. Yes this is silly, but Parcel does
 * not have an official way to make the watcher ignore some files.
 *
 * NB: this is not a Typescript file! (Parcel doesn't support plugins written
 * in TS.) No type checking!
 */
export default new Resolver({
  async resolve({ specifier, options: { projectRoot } }) {
    if (specifier.startsWith('locales:')) {
      const locale = specifier.substring('locales:'.length);

      const litConfig = JSON.parse(
        await promisify(fs.readFile)(
          path.join(projectRoot, 'lit-localize.json'),
          'utf-8',
        ),
      );

      const filePath =
        locale === 'config'
          ? path.join(projectRoot, litConfig.output.localeCodesModule)
          : path.join(projectRoot, litConfig.output.outputDir, `${locale}.ts`);

      await promisify(exec)('npx lit-localize build\n');

      return {
        // Rebuild if an XLIFF file changes, or the lit-localize config.
        invalidateOnFileChange: [
          ...(await allXlfFiles(projectRoot)),
          path.join(projectRoot, 'lit-localize.json'),
        ],
        filePath,
      };
    } else {
      return null;
    }
  },
});
