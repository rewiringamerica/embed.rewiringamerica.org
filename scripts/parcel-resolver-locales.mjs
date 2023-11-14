import { Resolver } from '@parcel/plugin';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
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
 * NB: this is not a Typescript file! (Parcel doesn't support plugins written
 * in TS.) No type checking!
 */
export default new Resolver({
  async resolve({ specifier, options: { projectRoot } }) {
    if (specifier.startsWith('locales:')) {
      await promisify(exec)('npx lit-localize build');

      const locale = specifier.substring('locales:'.length);
      const filePath =
        locale === 'config'
          ? path.join(projectRoot, 'generated/locales.ts')
          : path.join(projectRoot, `generated/strings/${locale}.ts`);

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
