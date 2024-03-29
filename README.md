# Rewiring America Embeddable Incentives Calculator

This is a custom web component that renders a calculator for home electrification incentives. Users input some information about themselves, and the calculator shows incentives --- tax credits, rebates, etc. --- that they're eligible for.

The calculator can be embedded on third-party websites. An instance of it is available on [Rewiring America's website](https://homes.rewiringamerica.org/calculator).

In addition to the calculator itself, this repo contains a small website that demonstrates the component. It's hosted at `https://embed.rewiringamerica.org`.

## Usage

To embed the calculator on your website:

1. Sign up for the [Rewiring America API](https://www.rewiringamerica.org/api) and get an API key.

2. Add the following to your page's `<head>` tag:

   ```html
   <script
     type="module"
     src="https://embed.rewiringamerica.org/state-calculator.js"
   ></script>
   <link
     rel="stylesheet"
     type="text/css"
     href="https://embed.rewiringamerica.org/rewiring-fonts.css"
   />
   ```

3. Add the following in the body of the page:

   ```html
   <rewiring-america-state-calculator api-key="YOUR_API_KEY">
   </rewiring-america-state-calculator>
   ```

The calculator conforms to WCAG 2.1 level AA. Our latest self-assessment for WCAG compliance can be found [in the /docs folder](/docs/calculator-vpat.pdf)

### Optional Attributes

The calculator component supports the following attributes to customize its behavior.

| Attribute          | Type            | Description                                                                                                                                  | Default                                           |
| ------------------ | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `lang`             | string          | The language of user-visible text. `en` (English) and `es` (Spanish) are supported. Any other value will fall back to English.               | `lang` from nearest DOM ancestor, or `en` if none |
| `state`            | 2-letter string | Two-letter state code (e.g. `RI`, `CO`). If set, the calculator will show an error message if the user inputs a location outside that state. | none                                              |
| `zip`              | 5-digit string  | A ZIP code to pre-populate in the form.                                                                                                      | none                                              |
| `owner-status`     | string          | A homeowner/renter status to pre-populate in the form.<br/>Valid values: `homeowner`, `renter`                                               | `homeowner`                                       |
| `household-income` | number          | A household income to pre-populate in the form.                                                                                              | `0`                                               |
| `tax-filing`       | string          | A tax-filing status to pre-populate in the form.<br/>Valid values: `single`, `joint`, `married_filing_separately`, `hoh`                     | `single`                                          |
| `household-size`   | number          | A household size to pre-populate in the form. <br/>Valid values: 1 through 8 inclusive                                                       | `1`                                               |

Values are pre-populated from attributes on page load, and when the user clicks "Reset calculator".

### Events

The calculator components dispatches custom events when the form is submitted and reset. Their `target` is the calculator component. You can listen for them with `addEventListener()`. These events are not cancelable.

When the event is dispatched, the form submission or reset has already happened, and you don't need to do anything. These events are exposed for analytics purposes.

| Event name             | `detail`                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calculator-submitted` | The key `formData` contains an object with the form data that was submitted. Possible keys are `zip`, `owner_status`, `household_income`, `household_size`, `tax_filing`, and `projects`. |
| `calculator-reset`     | None                                                                                                                                                                                      |

## Running / building

### Run a development server

1. Get an API key for the Rewiring America incentives API by [signing up here](https://www.rewiringamerica.org/api). (RA employees: ask internally.)

2. Put the API key in a file called `.env.local` at the root of your working copy, as follows:

   ```
   REWIRING_AMERICA_API_KEY=zpka_********************************_********
   ```

3. Install Node 18. We recommend using [NVM](https://github.com/nvm-sh/nvm).
4. Install Yarn by running `corepack enable`.
5. Run `yarn install` to install dependencies.
6. Run `yarn serve:widget` to run a local server that serves the embed demo website. Access it at `http://localhost:1234`.

### Build for embedding

1. Run `yarn build:widget` to build a single `.js` file containing the calculator and all of its transitive dependencies.

2. The bundled file is written to `dist/state-calculator.js`. This file and `dist/rewiring-fonts.css` are all that's needed to embed the calculator on any webpage.

## Roadmap

This codebase doesn't have a significant roadmap of its own. Changes here are primarily driven by the needs of our broader incentives API / calculator project. As the API expands to incentives with more complex structures, this frontend will evolve to match.

There are a few tasks specific to this codebase that we're interested in:

- Automatically generating `src/api/calculator-types-v1.ts` from the [API spec](https://api.rewiringamerica.org/spec.json), rather than manually maintaining it.

- Better test coverage, including tests that mock out API responses.

### Deprecating old frontend

This codebase actually contains two calculator frontends: one centered in `src/calculator.ts` and one centered in `src/state-calculator.ts`. **The former is soon to be deprecated and should not be used anymore**. It only has support for federal incentives from the Inflation Reduction Act. The latter has support for incentives from states and utilities, and is where all new development is happening.

## Contributing

If you find an inaccuracy in **incentive information**, please see our [incentive API repo](https://github.com/rewiringamerica/api.rewiringamerica.org) for what to do.

If you find a visual, behavioral, or accessibility bug in the _new_ calculator frontend (that is, the one that looks like [this](https://homes.rewiringamerica.org/calculator)), please file an issue in this repo. (The old frontend is soon to be deprecated, so there's no need to file issues for it.)

If you have a feature request for the new frontend, please file it as an issue. We can't make promises of when or if we'll get to it, but we are interested to hear what people want from this project.

We aren't ruling out accepting external code contributions, but we'd like to discuss it before you put too much work into a PR. The best place to have that discussion is in an issue on this repo, but you can also email us at `api@rewiringamerica.org`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for a guide to the codebase.
