import { msg } from '@lit/localize';
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import { HTMLTemplateResult, html } from 'lit';
import { questionIcon } from './icons';

/** Finds the first SlTooltip ancestor of the given element. */
function findTooltipAncestor(element: HTMLElement): SlTooltip {
  let target = element;
  while (!(target instanceof SlTooltip)) {
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

/**
 * A wrapper for sl-tooltip that renders a clickable question-mark icon to
 * trigger it, and makes it so that clicking anywhere other than the tooltip
 * dismisses it.
 */
export function tooltipButton(
  text: string,
  iconSize: number,
): HTMLTemplateResult {
  return html`
    <sl-tooltip content=${text} trigger="manual" hoist>
      <button
        class="tooltip-icon"
        type="button"
        title="${msg('More information', { desc: 'button caption' })}"
        @click=${toggleTooltip}
        @blur=${hideTooltip}
      >
        ${questionIcon(iconSize, iconSize)}
      </button>
    </sl-tooltip>
  `;
}
