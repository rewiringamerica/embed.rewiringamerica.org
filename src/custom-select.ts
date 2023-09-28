import { customElement } from 'lit/decorators.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/menu/menu.js';
import SlSelect from '@shoelace-style/shoelace/dist/components/select/select.js';

@customElement('ra-sl-select')
export class CustomSelect extends SlSelect {
}

declare global {
  interface HTMLElementTagNameMap {
    'ra-sl-select': CustomSelect;
  }
}
