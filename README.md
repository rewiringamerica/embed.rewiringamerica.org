# Overview

Takes functionality from our [public website calculator](https://www.rewiringamerica.org/app/ira-calculator) and packages it up in a custom web component built using `lit`. Lit's `Task` library takes care of watching the form parameters for changes
and fetching data from our API.

**Note:** API keys are required, sign up on our [API homepage](https://www.rewiringamerica.org/api).

# Documentation

- [Embed usage](https://api.rewiringamerica.org/docs/v0/embed)
- [Calculator examples](https://glitch.com/~rewiring-america-calculator-widget)

# Development

- Get an incentives API key, and put it in a local file `.env.local` like so:
  ```
  REWIRING_AMERICA_API_KEY=zpka_********************************_********
  ```
  You can also set that as an environment variable, if you prefer.
- `yarn` to install dependencies
- `yarn serve:widget` and open `http://localhost:1234/` to start working - should refresh when files change
- Open `http://localhost:1234/working-copy.html` to test against the dev API service
- `yarn build:widget` to build the deployment artifacts (Vercel does this for production deploys)

# Styles

For better or worse, using BEM to keep CSS manageable. This may be overkill since LitElement encapsulates the styles for us already.

The CSS font-face does not seem to apply if fonts are loaded by the Shadow DOM's styles, so a separate font stylesheet is provided for these.

# Hosting

This site is deployed using the [embed-rewiring-america](https://vercel.com/rewiring-america/embed-rewiringamerica-org) project on Vercel. The domain `embed.rewiringamerica.org` points to Vercel and is [configured in Google Domains](https://domains.google.com/registrar/rewiringamerica.org/dns).

# TODO

Features and content:

- [x] Add remaining guidance and disclaimer copy for <80% and >150% AMI.
- [ ] Add reset button to form?
- [ ] Switch order of incentives depending on whether credits/rebates are more useful.
- [x] Add currency formatting to the income input element. Using [autonumeric](http://autonumeric.org), which is large.
- [ ] Consider [Inputmask](https://robinherbots.github.io/Inputmask/#/documentation/numeric) in future.
- [x] Use a better tooltip component to ensure tooltips are readable at mobile breakpoints. Trying Shoelace's [tooltip](https://shoelace.style/components/tooltip).
- [ ] Think about how the 'back to calculator' links should work on RA's detail pages ([example](https://www.rewiringamerica.org/app/ira-calculator/information/electrical-panel))
- [ ] Add analytics support (Amplitude events?)
- [ ] Add support for Spanish translations.
- [ ] Send javascript events for calculate, results, project details clicks.

Robustness:

- [x] Take a copy of fonts and serve them from this domain.
- [ ] Port to API v1's calculator endpoint.
- [ ] Add slots to allow customizing the form intro text.
- [x] Add UI tests with Cypress, run in CI.
- [ ] Add unit tests, run in CI.
- [ ] How do we handle versioning?
- [ ] Work with Zuplo to add `origin` configs to API keys and prevent use of API keys outside specific hosts.
- [ ] Generate types (and API client?) automatically from OpenAPI file.
- [x] Protect main branch, require PRs.

Optimizations:

- [ ] Add support for caching results in localStorage.
- [ ] Add support for showing default list of incentives (from `/api/v0/incentives`).
- [ ] Reuse microcopy from Rewiring America's CMS to avoid duplication between this repo and our website.

Roadmap:

- [ ] Open source?
- [ ] Do we need a way to filter the kinds of incentives offered?
- [ ] Query by address for v1?
- [ ] Respond to customer requests for customization/functionality.

Bugs:

- [ ] Clicking the tooltip for Household Income should focus the input. Do we need `delegatesFocus` or do we need to refactor the input into a slot so it's light DOM?
- [ ] Tapping the tooltip on mobile probably shouldn't select the field. Move outside the label maybe?

# References

- [Lit](https://lit.dev)
- [Lit Task](https://github.com/lit/lit/tree/main/packages/labs/task)
- [Rewiring America API](https://api.rewiringamerica.org/docs/)
- [BEM](https://getbem.com/introduction/)
- [Shoelace](https://shoelace.style)
