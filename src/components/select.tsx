import { flip, useFloating } from '@floating-ui/react-dom';
import { Listbox, Transition } from '@headlessui/react';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import SlSpinner from '@shoelace-style/shoelace/dist/react/spinner';
import clsx from 'clsx';
import { Fragment } from 'react';
import { Check, DownTriangle } from '../icons';
import { FormLabel } from './form-label';

export type Option<T extends string> = {
  value: T;
  label: string;
  iconURL?: URL;
};

export type SelectProps<T extends string> = {
  /**
   * The HTML id of the focusable element. Also used as the "name" of the
   * form element.
   */
  id: string;
  options: Option<T>[];
  /** Shown above the select. */
  labelText: string;
  /**
   * If true, there will be no visible label text, but labelText will be used
   * as the ARIA label.
   */
  hiddenLabel?: boolean;
  tooltipText?: string;
  disabled?: boolean;
  /** Display a loading spinner just to the left of the arrow. */
  loading?: boolean;
  /** Shown in the element when nothing is selected, or options is empty. */
  placeholder?: string;
  /** Shown below the select element. */
  helpText?: string;
} & (
  | {
      multiple: false;
      currentValue: T;
      onChange: (newValue: T) => void;
    }
  | {
      multiple: true;
      currentValue: T[];
      onChange: (newValues: T[]) => void;
    }
);

/** Renders the tags in the multiselect. */
const renderTag = (label: string, iconURL?: URL) => (
  <div
    className={clsx(
      'flex',
      'gap-2',
      'px-3',
      'bg-grey-100',
      'rounded',
      'border',
      'border-grey-200',
      'items-center',
      'text-sm',
      // If this has an icon, it may have long text; let the browser
      // shrink it as necessary
      iconURL && 'min-w-0',
    )}
  >
    {iconURL && (
      <SlIcon className="text-base text-grey-700" src={iconURL.toString()} />
    )}
    <span className="whitespace-nowrap overflow-hidden text-ellipsis">
      {label}
    </span>
  </div>
);

export const Select = <T extends string>({
  id,
  options,
  disabled,
  loading,
  multiple,
  labelText,
  hiddenLabel,
  tooltipText,
  placeholder,
  helpText,
  currentValue,
  onChange,
}: SelectProps<T>) => {
  const firstCurrentOption = multiple
    ? options.find(o => currentValue.includes(o.value))
    : options.find(o => o.value === currentValue);

  let buttonContents = null;
  if (multiple) {
    // Render a tag for the first selected option (if any), followed by a
    // tag with "+N" if there are additional selected options.
    if (currentValue.length > 0) {
      buttonContents = (
        <div className="grow ml-1 py-1 h-full min-w-0 flex gap-1">
          {renderTag(firstCurrentOption!.label, firstCurrentOption!.iconURL)}
          {currentValue.length > 1 && renderTag(`+${currentValue.length - 1}`)}
        </div>
      );
    }
  } else {
    if (firstCurrentOption) {
      buttonContents = (
        <div className="grow ml-3 flex gap-2 items-center">
          {firstCurrentOption.iconURL && (
            <SlIcon
              className="text-lg text-grey-700"
              src={firstCurrentOption.iconURL.toString()}
              aria-hidden={true}
            />
          )}
          <div className={clsx(disabled && 'text-grey-500')}>
            {firstCurrentOption.label}
          </div>
        </div>
      );
    }
  }

  // For positioning the Listbox.Options. It will be below the Listbox.Button
  // unless there's not enough space, in which case it will be above.
  const { refs, floatingStyles } = useFloating({
    middleware: [flip()],
  });

  return (
    <div>
      <Listbox
        as="div"
        className="relative"
        name={id}
        value={currentValue}
        disabled={disabled}
        multiple={multiple}
        onChange={onChange}
      >
        <FormLabel hidden={hiddenLabel} tooltipText={tooltipText}>
          <Listbox.Label>{labelText}</Listbox.Label>
        </FormLabel>
        <Listbox.Button
          id={id}
          ref={refs.setReference}
          className={clsx(
            'group',
            'flex',
            'gap-2',
            'items-center',
            'w-full',
            // TODO make this h-12 once the text inputs are the right height
            'h-[46px]',
            'border',
            'border-grey-200',
            !disabled && 'hover:border-grey-600',
            // Move the outline inward to cover up the border
            'outline-offset-[-1px]',
            'focus:outline',
            'focus:outline-2',
            'focus:outline-purple-500',
            'rounded',
            'bg-white',
          )}
        >
          {buttonContents ?? (
            <div className="grow ml-3 text-left text-grey-500">
              {placeholder}
            </div>
          )}
          {loading && <SlSpinner />}
          {/* This will look for the parent element with the "group" class, and
           * check whether its data-headlessui-state attribute contains "open"
           */}
          <div
            className={clsx(
              'group-data-open:rotate-180',
              'mr-3',
              disabled && 'text-grey-500',
            )}
            aria-hidden={true}
          >
            <DownTriangle w={11} h={5} />
          </div>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease"
          enterFrom="transform scale-90 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-100 ease"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-90 opacity-0"
        >
          <Listbox.Options
            ref={refs.setFloating}
            style={floatingStyles}
            className={clsx(
              'z-10',
              'w-full',
              'max-h-96', // 384px = up to 9 items without overflow
              'overflow-y-auto',
              'cursor-pointer',
              'bg-white',
              'shadow-elevation',
              'rounded',
              'outline-0',
              'focus:outline',
              'focus:outline-2',
              'focus:outline-purple-500',
              'py-2',
            )}
          >
            {options.map(o => (
              <Listbox.Option
                key={o.value}
                value={o.value}
                data-value={o.value}
                className={clsx(
                  'flex',
                  'gap-2',
                  'items-center',
                  'ui-active:bg-purple-100',
                  'px-4',
                  'py-1.5',
                )}
              >
                {multiple &&
                  (currentValue.includes(o.value) ? (
                    <Check w={20} h={20} />
                  ) : (
                    <div className="w-5" />
                  ))}
                {o.iconURL && (
                  <SlIcon
                    className="text-lg text-grey-700"
                    src={o.iconURL.toString()}
                  />
                )}
                {o.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
      {helpText && (
        <div className="mx-3 mt-1 text-grey-400 text-xsm leading-normal">
          {helpText}
        </div>
      )}
    </div>
  );
};
