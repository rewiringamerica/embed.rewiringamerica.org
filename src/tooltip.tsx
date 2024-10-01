import SlTooltipComponent from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import SlTooltip from '@shoelace-style/shoelace/dist/react/tooltip';
import { css } from 'lit';
import { FC, useEffect, useRef } from 'react';
import { useTranslated } from './i18n/use-translated';
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

export const tooltipStyles = css`
  /* shoelace style overrides */
  sl-tooltip {
    --max-width: var(--ra-tooltip-max-width);
    --sl-tooltip-arrow-size: var(--ra-tooltip-arrow-size);
    --sl-tooltip-padding: var(--ra-tooltip-padding);
    --sl-tooltip-background-color: var(--ra-tooltip-background-color);
    --sl-tooltip-color: var(--ra-tooltip-color);
    --sl-tooltip-border-radius: var(--ra-tooltip-border-radius);
    --sl-tooltip-font-family: var(--ra-embed-font-family);
    --sl-tooltip-font-size: var(--ra-embed-font-size);
    --sl-tooltip-line-height: var(--ra-embed-line-height);
    --sl-tooltip-font-weight: var(--ra-embed-font-weight);
    --sl-z-index-tooltip: 10000;
    text-transform: none;
    letter-spacing: normal;
  }

  sl-tooltip::part(body) {
    box-shadow: var(--ra-tooltip-box-shadow);
    border-radius: var(--sl-tooltip-border-radius);
    border: var(--ra-tooltip-border);
    pointer-events: auto;
  }

  /* This button is just an icon; make everything else disappear */
  button.tooltip-icon {
    border: 0;
    background-color: transparent;
    padding: 0;

    cursor: pointer;
    vertical-align: middle;
  }
`;

export const TooltipButton: FC<{
  text: string;
  iconSize: number;
}> = ({ text, iconSize }) => {
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

  const { msg } = useTranslated();

  return (
    <SlTooltip content={text} trigger="manual" hoist>
      <button
        ref={ref}
        className="tooltip-icon"
        type="button"
        title={msg('More information', { desc: 'button caption' })}
      >
        <QuestionIcon w={iconSize} h={iconSize} opacity={0.5} />
      </button>
    </SlTooltip>
  );
};
