import { StrictMode } from 'react';
import { Root, createRoot } from 'react-dom/client';

/**
 * During the React transition, we render various sub-parts of the component
 * using React; this is where that's actually carried out.
 *
 * During render(), Lit elements add empty divs to the DOM, for React elements
 * to be rendered into later. Pass in a mapping of those empty divs' IDs
 * to the React elements to be rendered into them, as reactElements, from the
 * Lit element's updated() function.
 *
 * The React roots are cached in reactRoots so they can be reused if Lit has
 * preserved the underlying DOM node across render cycles.
 */
export function renderReactElements(
  shadowRoot: ShadowRoot,
  reactElements: Map<string, React.ReactElement>,
  reactRoots: Map<string, { reactRoot: Root; domNode: HTMLElement }>,
) {
  reactElements.forEach((element, rootId) => {
    let root: Root | null = null;

    // If we already have a React root for this element, and the DOM node is
    // still part of the document, reuse it.
    if (reactRoots.has(rootId)) {
      const { reactRoot, domNode } = reactRoots.get(rootId)!;
      if (domNode.isConnected) {
        root = reactRoot;
      } else {
        reactRoots.delete(rootId);
      }
    }

    // If there was no React root for this element, or the DOM node it was
    // created on is not part of the document, create a new one.
    if (!root) {
      const domNode = shadowRoot.getElementById(rootId);
      if (!domNode) {
        return;
      }
      root = createRoot(domNode);
      reactRoots.set(rootId, { reactRoot: root, domNode });
    }

    root.render(<StrictMode>{element}</StrictMode>);
  });
  reactElements.clear();
}
