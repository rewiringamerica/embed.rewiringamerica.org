import { HTMLTemplateResult, html } from 'lit';
import { questionIcon } from './icons';
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

function toggleTooltip(event: MouseEvent) {
  // The target may be a descendant of the tooltip; find the tooltip itself.
  let target = event.target as HTMLElement;
  while (!(target instanceof SlTooltip)) {
    target = target.parentElement!;
  }

  const tooltip = target as SlTooltip;
  if (tooltip.open) {
    tooltip.hide();
  } else {
    tooltip.show();
  }
  event.stopPropagation();
}

/**
 * When a tooltip is shown, add a one-time mousedown listener to the document
 * that dismisses any open tooltips.
 */
function onTooltipShow(showEvent: CustomEvent) {
  // Calling abort() on this will remove the event listeners
  const abortController = new AbortController();
  const tooltip = showEvent.target as SlTooltip;

  document.addEventListener(
    'mousedown',
    mouseEvent => {
      tooltip.hide();
      abortController.abort();
      mouseEvent.stopPropagation();
    },
    { signal: abortController.signal },
  );
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
    <sl-tooltip
      content=${text}
      trigger="manual"
      hoist
      @sl-show=${onTooltipShow}
    >
      <button
        class="tooltip-icon"
        type="button"
        title="More information"
        @click=${toggleTooltip}
      >
        ${questionIcon(iconSize, iconSize)}
      </button>
    </sl-tooltip>
  `;
}
