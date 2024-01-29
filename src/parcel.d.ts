declare module 'bundle-text:*' {
  const value: string;
  export default value;
}

/**
 * Import an SVG file as "jsx:./path/to/icon.svg" to import it as if it were a
 * JSX <svg> element. This is done with a Parcel transformer.
 */
declare module 'jsx:*.svg' {
  import { FunctionComponent, SVGProps } from 'react';
  const svg: FunctionComponent<SVGProps<SVGSVGElement>>;
  export default svg;
}
