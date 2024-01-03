import { msg } from '@lit/localize';
import SlTooltipComponent from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import SlTooltip from '@shoelace-style/shoelace/dist/react/tooltip';
import { useEffect, useRef } from 'react';
import { QuestionIcon } from './icons';

/** Finds the first SlTooltip ancestor of the given element. */
function findTooltipAncestor(element: HTMLElement): SlTooltipComponent {
  let target = element;
  while (!(target instanceof SlTooltipComponent)) {
    target = target.parentElement!;
  }
  return target;
}

function toggleTooltip(event: MouseEvent) {
  // The target may be a descendant of the tooltip; find the tooltip itself.
  const tooltip = findTooltipAncestor(event.target as HTMLElement);
  if (tooltip.open) {
    tooltip.hide();
  } else {
    tooltip.show();
  }
  event.stopPropagation();
}

function hideTooltip(event: FocusEvent) {
  const tooltip = findTooltipAncestor(event.target as HTMLElement);
  tooltip.hide();
  event.stopPropagation();
}

type Props = {
  text: string;
  iconSize: number;
};

export const TooltipButton = ({ text, iconSize }: Props) => {
  // We can't use React's event handling here. This component is used inside
  // Shoelace <sl-select>'s label slot. Their <label> element has a native
  // onclick handler that focuses the labeled element (rather than using "for").
  // If we used React's onClick attribute on the button, our event handler
  // would fire after Shoelace's native one; however, we don't want the latter
  // to run at all.
  //
  // So we use a ref to get around React and put handlers on the real DOM.
  // They stop propagation and thus prevent Shoelace's handler from running.
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('click', toggleTooltip);
      ref.current.addEventListener('blur', hideTooltip);
    }
  });

  return (
    <SlTooltip content={text} trigger="manual" hoist>
      <button
        ref={ref}
        className="tooltip-icon"
        type="button"
        title={msg('More information', { desc: 'button caption' })}
      >
        <QuestionIcon w={iconSize} h={iconSize} />
      </button>
    </SlTooltip>
  );
};
