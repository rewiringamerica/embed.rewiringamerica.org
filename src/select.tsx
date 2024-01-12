import SlSelectComponent from '@shoelace-style/shoelace/dist/components/select/select';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import SlOption from '@shoelace-style/shoelace/dist/react/option';
import SlSelect from '@shoelace-style/shoelace/dist/react/select';
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';
import { css } from 'lit';
import { useEffect, useRef } from 'react';

export interface OptionParam<T extends string> {
  label: string;
  value: T;
  iconURL?: URL;
}

interface SLSelectProps<T extends string> {
  id: string;
  labelSlot?: React.ReactElement;
  options: OptionParam<T>[];
  helpText?: string;
  placeholder?: string;
  placement?: 'top' | 'bottom';
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

export interface SingleSelectProps<T extends string> extends SLSelectProps<T> {
  currentValue: T;
  onChange?: (newValue: T) => void;
  loading?: boolean;
}

export interface MultiSelectProps<T extends string> extends SLSelectProps<T> {
  currentValues: T[];
  onChange?: (newValues: T[]) => void;
  maxOptionsVisible?: number;
}

/**
 * Make the Tab key close an open SlSelect dropdown.
 */
const handleTabDown = (e: React.KeyboardEvent) => {
  // In the case we're interested in, the target is an <sl-option>, and its
  // parent is the <sl-select>.
  const target = e.target as Node;
  const selectTarget = target.parentNode;

  if (
    selectTarget instanceof SlSelectComponent &&
    e.key === 'Tab' &&
    selectTarget.open
  ) {
    e.preventDefault();
    e.stopPropagation();
    selectTarget.hide();
    selectTarget.displayInput.focus({ preventScroll: true });
  }
};

const option = <T extends string>({
  label,
  value,
  iconURL,
}: OptionParam<T>) => {
  const iconElement = iconURL ? (
    <SlIcon
      slot="prefix"
      src={iconURL.toString()}
      data-src={iconURL.toString()}
    ></SlIcon>
  ) : null;

  return (
    <SlOption key={value} value={value}>
      {label} {iconElement}
    </SlOption>
  );
};

export const Select = <T extends string>({
  id,
  labelSlot,
  options,
  helpText,
  placeholder,
  placement,
  currentValue,
  onChange,
  ariaLabel,
  required,
  disabled = false,
  loading = false,
}: SingleSelectProps<T>) => {
  const currentOption = options.find(option => option.value === currentValue);
  const prefixIcon = currentOption?.iconURL ? (
    <SlIcon src={currentOption.iconURL.toString()} slot="prefix"></SlIcon>
  ) : loading ? (
    <SlSpinner slot="prefix"></SlSpinner>
  ) : null;

  return (
    <div>
      <SlSelect
        id={id}
        name={id}
        value={currentValue}
        helpText={helpText}
        placeholder={placeholder}
        placement={placement ?? 'bottom'}
        onSlChange={
          onChange
            ? e => onChange((e.currentTarget as SlSelectComponent).value as T)
            : () => {}
        }
        aria-label={ariaLabel}
        required={required}
        disabled={disabled}
        onKeyDown={handleTabDown}
        hoist
        data-loading={loading ? true : undefined}
      >
        {prefixIcon} {labelSlot}
        <SlIcon slot="expand-icon"></SlIcon>
        {options.map(o => option(o))}
      </SlSelect>
      <span className="focus"></span>
    </div>
  );
};

export const MultiSelect = <T extends string>({
  id,
  labelSlot,
  currentValues,
  options,
  helpText,
  placeholder,
  maxOptionsVisible,
  placement,
  onChange,
}: MultiSelectProps<T>) => {
  const ref = useRef<SlSelectComponent>(null);

  // Customize the tag that appears in the combo box.
  useEffect(() => {
    if (ref.current) {
      ref.current.getTag = option => {
        const src = option
          .querySelector('sl-icon[slot="prefix"]')
          ?.getAttribute('data-src');

        return `
          <sl-tag removable>
            <sl-icon src="${src}" style="padding-inline-end: .5rem;"></sl-icon>
            ${option.getTextLabel()}
          </sl-tag>
        `;
      };
    }
  });

  return (
    <div>
      <SlSelect
        ref={ref}
        id={id}
        name={id}
        value={currentValues}
        helpText={helpText}
        placeholder={placeholder}
        maxOptionsVisible={maxOptionsVisible}
        placement={placement ?? 'bottom'}
        hoist
        multiple
        onKeyDown={handleTabDown}
        onSlChange={
          onChange
            ? e => onChange((e.currentTarget as SlSelectComponent).value as T[])
            : () => {}
        }
      >
        {labelSlot}
        <SlIcon slot="expand-icon"></SlIcon>
        {options.map(o => option(o))}
      </SlSelect>
      <span className="focus"></span>
    </div>
  );
};

export const selectStyles = css`
  sl-select {
    --sl-input-height-medium: 2.8215rem;

    --sl-input-font-family: var(--ra-embed-font-family);

    --sl-input-focus-ring-color: var(--ra-select-focus-color);
    --sl-input-focus-ring-style: solid;
    --sl-focus-ring-width: 1px;

    --sl-input-border-width: 1px;
    --sl-input-border-color-focus: var(--ra-select-focus-color);

    --sl-font-sans: var(--ra-embed-font-family);

    /*
     * This replaces the highlighted-row background color. There's no variable
     * specifically for that.
     */
    --sl-color-primary-600: var(--ra-select-focus-color);
  }

  /* Adjust spacing between content and left edge */
  sl-select::part(combobox) {
    padding-inline: var(--sl-spacing-small);
  }

  sl-select::part(form-control-label) {
    /* Override inline-block to prevent empty space above the label */
    display: block;
    /* We'll do our own margin/padding on the label */
    margin: 0;
  }

  /* Move the loading spinner to the right (but before the expand icon) */
  sl-select[data-loading]::part(prefix) {
    order: 1;
  }

  sl-select::part(expand-icon) {
    order: 2;
    content: '';
    justify-self: end;
    width: 0.6em;
    height: 0.4em;
    background-color: var(--ra-select-arrow-color);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  sl-select::part(form-control-help-text) {
    color: #757575;
    font-size: 0.6875rem;
    line-height: 150%;
    margin: 0.25rem 0.75rem 0 0.75rem;
  }

  /* Get the tag close to the side edges of the combobox */
  sl-select#projects::part(tags) {
    margin-inline-start: calc(0.25rem - var(--sl-spacing-small));
  }
`;
