import AutoNumeric from 'autonumeric';
import { useRef } from 'react';
import { TextInput } from './text-input';

type Props = {
  value: string;
  min?: number;
  max?: number;
  placeholder?: string;
  required?: boolean;
  name: string;
  onChange: (newValue: string) => void;
};

export function CurrencyInput({
  name,
  value,
  min = 0,
  max = Number.MAX_VALUE,
  placeholder = '$0.00',
  required,
  onChange,
}: Props) {
  const autonumericRef = useRef<AutoNumeric | null>(null);

  return (
    <TextInput
      ref={ref => {
        if (ref) {
          autonumericRef.current = new AutoNumeric(ref, value, {
            ...AutoNumeric.getPredefinedOptions().NorthAmerican,
            // Prevent autonumeric from populating the field with "$" when focusing
            // it while empty. (That would suppress the browser's "fill out this
            // field" indicator.)
            emptyInputBehavior: 'press',
            minimumValue: min.toString(),
            maximumValue: max.toString(),
            decimalPlaces: 0,
            upDownStep: 1000,
            modifyValueOnWheel: false,
          });
        } else {
          autonumericRef.current?.remove();
        }
      }}
      type="text"
      id={name}
      name={name}
      inputMode="numeric"
      placeholder={placeholder}
      required={required}
      onChange={() =>
        onChange(autonumericRef.current?.getNumericString() ?? '0')
      }
    />
  );
}
