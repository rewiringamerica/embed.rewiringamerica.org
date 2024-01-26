import { flip, offset, shift, useFloating } from '@floating-ui/react-dom';
import { msg } from '@lit/localize';
import clsx from 'clsx';
import { FC, useId, useState } from 'react';
import { QuestionIcon } from '../icons';

/**
 * Renders the question mark icon in a button, which shows a popover containing
 * the given text when clicked. Tabbing away from the button, or clicking
 * anywhere, will close the popover.
 */
export const TooltipButton: FC<{ text: string }> = ({ text }) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    middleware: [flip(), shift(), offset(10)],
    placement: 'top',
  });

  return (
    <>
      <button
        ref={refs.setReference}
        type="button"
        onClick={() => {
          // Clicking does not automatically focus the button on MobileSafari.
          // Focus it explicitly so that the tooltip can be closed by clicking
          // anywhere else (via the onBlur handler).
          if (!isOpen) {
            refs.reference.current!.focus();
          }
          setIsOpen(!isOpen);
        }}
        onBlur={() => setIsOpen(false)}
        onKeyDown={e => {
          // "Escape" is standard; some older browsers use "Esc"
          if (e.key === 'Escape' || e.key === 'Esc') {
            setIsOpen(false);
          }
        }}
        aria-label={msg('More information', { desc: 'button caption' })}
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
      >
        <span aria-hidden={true}>
          <QuestionIcon w={13} h={13} />
        </span>
      </button>
      {isOpen && (
        <div
          id={panelId}
          ref={refs.setFloating}
          style={floatingStyles}
          className={clsx(
            'z-10',
            'w-max',
            'max-w-70',
            'bg-white',
            'shadow-elevation',
            'rounded-lg',
            'px-6',
            'py-6',
            'leading-7',
          )}
          // Tell screenreaders to announce the contents of this panel when
          // they appear, without the user having to navigate to it.
          aria-live="polite"
        >
          {text}
        </div>
      )}
    </>
  );
};
