# Developer Guide

This is a guide to contributing to this codebase. It's intended both for Rewiring America engineers and external contributors.

## Getting Started

First, read the [README](README.md), especially the [running/building](README.md#running--building) section to get the calculator running locally.

## Codebase overview

All the code is TypeScript, and is required to typecheck without errors.

- One of the major design constraints in this codebase is the need to embed the component on third-party sites. We strive to keep the bundle size down by taking few dependencies and trying to keep them small. Among other things, that's why we don't use React.

- The component framework is [Lit](https://lit.dev/docs/v2/). We use [@lit/task](https://github.com/lit/lit/blob/HEAD/packages/task/README.md) to manage fetching from the API.

- The build system is [Parcel](https://parceljs.org). In addition to building the [embed demo site](https://embed.rewiringamerica.org), it builds the file `src/state-calculator.ts` and all of its transitive dependencies into a single `.js` file. That file is hosted on `embed.rewiringamerica.org` and referenced from third-party pages that include the embed.

  - The CSS font-face does not seem to apply if fonts are loaded by the Shadow DOM's styles, so we build a separate font stylesheet that embed clients reference.

- We use some components from [Shoelace](https://shoelace.style/).

### Accessibility

- To allow this calculator to be embedded on state government websites, we require compliance with WCAG 2.1 level AA accessibility guidelines.

- We use `cypress-axe` to maintain a baseline of automated conformance, and periodically review against a [Voluntary Product Accessibility Template](https://www.itic.org/policy/accessibility/vpat) for steps that can only be assessed manually.

- The latest VPAT can be found [in the /docs folder](/docs/calculator-vpat.pdf) and the working copy is hosted on [Google Docs](https://docs.google.com/document/d/1gxTSQE9jUaM12F-kpQ-m08OQOTwxbPGQ/edit).

- Any significant UI changes or additions will need to be manually reviewed against the VPAT.

### Internationalization

- The new frontend is localized into Spanish. Ideally, any new user-visible strings should be translated into Spanish before landing.

- It's acceptable to use machine translation, but any machine-translated output should be reviewed by a fluent human Spanish speaker before landing.

- We use [@lit/localize](https://lit.dev/docs/localization/overview/) to extract strings and select translations at runtime. The source of truth for translations is the file `translations/es.xlf`.

  1. When adding or modifying English strings, run `yarn strings:extract` to update `translations/es.xlf` with the new strings.

  2. Add Spanish translations to the new strings in that file, inside `<target>` elements.

  3. Run `yarn strings:build` to generate the JavaScript with the translations. Make sure the translations show up in the UI when you set the attribute `lang="es"` on the calculator element .

  4. Include the changes in `es.xlf` and `src/locales/strings/es.ts` in your PR.

## Branching

- All PRs should be branches off of `main`.
- Vercel makes a preview deploy for every PR, and comments on the PR with a link.
- PRs should be landed by "squash and merge". We don't like merge commits or cluttered history.
- There should not be long-lived feature branches.
- Anything landed on `main` **is deployed to production immediately**.
  - In particular, this means third-party sites with the embed will reflect changes landed on `main` **immediately**. Be careful!

## Code review

All PRs are code-reviewed and require at least one approval from a repo committer (which currently includes RA staff only) before merging. PR authors merge their own PRs once they're approved and tests are passing.

To speed things up, we sometimes "approve with comments": approving but pointing out minor things that we trust the author to fix before merging, or that we leave up to the author's discretion. After fixing (or not fixing) such things, the author is free to merge without further review. (However, they can request another review if they want.)

## Tests

There are a few basic [Cypress](https://cypress.io) tests defined in `cypress/e2e`. They include a basic accessibility check using `cypress-axe`. The tests are run for every PR, and are required to pass before the PR can land.

Note that the Cypress tests are using the live production API, not a mock. It's possible for them to fail because of non-breaking API changes, unrelated to changes in this codebase (for example, if a test is looking for a specific string on the page).

We use Prettier and ESLint; both are run for every PR and are required to report no issues. We recommend setting up your editor to run Prettier automatically on save.
