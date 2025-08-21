# Rewiring America Embeddable Calculators

This repo contains custom web components, with information on home electrification, that can be embedded on third-party websites. There are currently two:

- **Incentives calculator**: users input some information about themselves, and the calculator shows incentives --- tax credits, rebates, etc. --- that they're eligible for. It is used on [Rewiring America's website](https://homes.rewiringamerica.org/calculator).

- **Bill impact calculator**: users input some information about their home, and the calculator shows the likely range of energy bill savings that could result from electrifying.

In addition to the calculator components, this repo contains a small website that demonstrates the components. It's hosted at `https://embed.rewiringamerica.org`.

## Usage — Incentives Calculator

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

| Attribute          | Type                   | Description                                                                                                                                                                                                                       | Default                                           |
| ------------------ | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `lang`             | string                 | The language of user-visible text. `en` (English) and `es` (Spanish) are supported. Any other value will fall back to English.                                                                                                    | `lang` from nearest DOM ancestor, or `en` if none |
| `state`            | 2-letter string        | Two-letter state code (e.g. `RI`, `CO`). If set, the calculator will show an error message if the user inputs a location outside that state.                                                                                      | none                                              |
| `zip`              | 5-digit string         | A ZIP code to pre-populate in the form.                                                                                                                                                                                           | none                                              |
| `owner-status`     | string                 | A homeowner/renter status to pre-populate in the form.<br/>Valid values: `homeowner`, `renter`                                                                                                                                    | `homeowner`                                       |
| `household-income` | number                 | A household income to pre-populate in the form.                                                                                                                                                                                   | `0`                                               |
| `tax-filing`       | string                 | A tax-filing status to pre-populate in the form.<br/>Valid values: `single`, `joint`, `married_filing_separately`, `hoh`                                                                                                          | `single`                                          |
| `household-size`   | number                 | A household size to pre-populate in the form. <br/>Valid values: 1 through 8 inclusive                                                                                                                                            | `1`                                               |
| `projects`         | comma-delimited string | Comma-delimited string used to filter eligible incentives by project type.<br> Valid values: `clothes_dryer`, `hvac`, `ev`, `solar`, `battery`, `water_heater`, `cooking`, `wiring`, `weatherization_and_efficiency`, `lawn_care` | none                                              |

Values are pre-populated from attributes on page load, and when the user clicks "Reset calculator".

### Events

The calculator component dispatches custom events when the form is submitted and reset. These are intended to be used for analytics. When the event is dispatched, the form submission or reset has already happened, and you don't need to do anything.

The events' `target` is the calculator component. They are not cancelable. You can listen for them with `addEventListener()`, as follows:

```html
<script>
  // NB:- place *after* the <rewiring-america-state-calculator> tag to ensure it exists:
  var calc = document.getElementsByTagName(
    'rewiring-america-state-calculator',
  )[0];
  calc.addEventListener('calculator-submitted', function (event) {
    // replace the following with a call to your event tracking system:
    console.log(event.detail.formData);
  });
</script>
```

| Event name             | `detail`                                                                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calculator-submitted` | The key `formData` contains an object with the form data that was submitted. Possible keys are `zip`, `owner_status`, `household_income`, `household_size`, `tax_filing`, and `projects`. |
| `calculator-reset`     | None                                                                                                                                                                                      |

### Customizing Colors

The colors of some UI elements can be customized by overriding CSS variables.

Overriding values must be defined on the calculator element. The values must be a color in absolute or relative [CSS `rgb()` syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb), and must not include an alpha value. For example:

```css
rewiring-america-state-calculator {
  /* Absolute value syntax */
  --ra-color-background-button: 195 0 74;

  /* Relative color syntax */
  --ra-color-text-link: from blue r g b;
}
```

| Variable name                  | Usage                                                             |
| ------------------------------ | ----------------------------------------------------------------- |
| `--ra-color-background-button` | The background color of the submit button in the calculator form. |
| `--ra-color-text-button`       | The text color of the submit button in the calculator form.       |
| `--ra-color-text-link`         | The text color of links throughout the calculator UI.             |

The calculator defines and uses many other CSS variables, but **their existence and behavior are not guaranteed to be stable**; override them at your own risk. Only variables prefixed with `--ra-` are supported customization points.

## Usage — Bill Impact Calculator

To embed the bill impact calculator on your website:

1. Sign up for the [Rewiring America API](https://www.rewiringamerica.org/api) and get an API key.

2. Add the following to your page's `<head>` tag:

   ```html
   <script
     type="module"
     src="https://embed.rewiringamerica.org/bill-impact-calculator.js"
   ></script>
   <link
     rel="stylesheet"
     type="text/css"
     href="https://embed.rewiringamerica.org/rewiring-fonts.css"
   />
   ```

3. Add the following in the body of the page:

   ```html
   <rewiring-america-bill-impact-calculator api-key="YOUR_API_KEY">
   </rewiring-america-bill-impact-calculator>
   ```

### Customization

The bill impact calculator supports the same [color customization CSS variables](#customizing-colors) as the incentives calculator.

The calculator does not support any attributes other than `api-key`.

### Events

The calculator component dispatches a custom event when the form is submitted. This is intended to be used for analytics. When the event is dispatched, the form submission has already happened, and you don't need to do anything.

The events' `target` is the calculator component. They are not cancelable. You can listen for them with `addEventListener()`, as follows:

```html
<script>
  // NB:- place *after* the <rewiring-america-bill-impact-calculator> tag to ensure it exists:
  var calc = document.getElementsByTagName(
    'rewiring-america-bill-impact-calculator',
  )[0];
  calc.addEventListener('bi-calculator-submitted', function (event) {
    // replace the following with a call to your event tracking system:
    console.log(event.detail.formData);
  });
</script>
```

| Event name                | `detail`                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bi-calculator-submitted` | The key `formData` contains an object with the form data that was submitted. The possible keys in that object are `buildingType`, `address`, `heatingFuel`, `waterHeatingFuel`, and `upgrade`. |

## Running / building

### Run a development server

1. Get an API key for the Rewiring America incentives API by [signing up here](https://www.rewiringamerica.org/api). (RA employees: ask internally.)

2. Put the API key in a file called `.env.local` at the root of your working copy, as follows:

   ```
   REWIRING_AMERICA_API_KEY=zpka_********************************_********
   ```

3. Install Node 22. We recommend using [NVM](https://github.com/nvm-sh/nvm).
4. Install Yarn by running `corepack enable`.
5. Run `yarn install` to install dependencies.
6. Run `yarn serve:widget` to run a local server that serves the embed demo website. Access it at `http://localhost:1234`.

### Build for embedding

1. Run `yarn build:widget` to build a single `.js` file containing the calculator and all of its transitive dependencies.

2. The bundled file is written to `dist/state-calculator.js`. This file and `dist/rewiring-fonts.css` are all that's needed to embed the calculator on any webpage.

### npm package

This codebase is also published as an npm package, `@rewiringamerica/embed.rewiringamerica.org`. However, this package is intended only for use by Rewiring America internal codebases. The [Usage section](#usage--incentives-calculator) describes the **only** supported way to display the calculator on third-party websites.

## Contributing

If you find an inaccuracy in **incentive information**, please see our [incentive API repo](https://github.com/rewiringamerica/api.rewiringamerica.org) for what to do.

If you find a visual, behavioral, or accessibility bug in the widgets, please file an issue in this repo.

If you have a feature request for the widgets, please file it as an issue. We can't make promises of when or if we'll get to it, but we are interested to hear what people want from this project.

We aren't ruling out accepting external code contributions, but we'd like to discuss it before you put too much work into a PR. The best place to have that discussion is in an issue on this repo, but you can also email us at `api@rewiringamerica.org`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for a guide to the codebase.
