import { css, html } from 'lit';
import { PROJECTS, Project, shortLabel } from './projects';
import { select } from './select';
import { RA_ICON_LIBRARY } from './state-calculator';

export const iconTabBarStyles = css`
  .icon-tab-bar {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;

    width: 83.3%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 1.5rem;
  }

  .icon-tab {
    /* Override default button styles */
    background-color: transparent;
    font-family: inherit;
    cursor: pointer;

    min-width: 6rem;

    height: 3rem;
    border: 1px solid #9b9b9b;
    border-radius: 1.5rem;
    padding: 0.75rem 1rem;

    /* Manage the gap between the icon and the caption */
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
  }

  .icon-tab--selected {
    cursor: default;

    background: var(--color-purple-500, #4a00c3);
    border-color: var(--color-purple-500, #4a00c3);
  }

  .icon-tab__caption {
    color: var(--color-purple-500, #4a00c3);
    font-size: 1rem;
    font-weight: 500;
    line-height: 125%;
    white-space: nowrap;
  }

  .icon-tab__caption--selected {
    color: white;
  }

  .icon-dropdown {
    margin-bottom: 1.5rem;
  }

  /*
  * Only show the tabs/pills on medium and large layout.
  * Only show dropdown on small layout.
  */
  @media only screen and (max-width: 640px) {
    .icon-tab-bar {
      display: none;
    }
  }

  @media only screen and (min-width: 641px) {
    .icon-dropdown {
      display: none;
    }
  }
`;

/**
 * On medium and large layouts, this is a horizontally flowed row of pill-shaped
 * buttons, with icon and text, representing projects. Clicking one selects that
 * single project. The pills can flow onto multiple lines.
 *
 * On small layouts, this is a single-select dropdown.
 */
export const iconTabBarTemplate = (
  tabs: Project[],
  selectedTab: Project,
  onTabSelected: (newSelection: Project) => void,
) => {
  const iconTabs = tabs.map(project => {
    const isSelected = project === selectedTab;
    const classes = (cls: string) =>
      isSelected ? `${cls} ${cls}--selected` : cls;
    return html`
      <button
        class="${classes('icon-tab')}"
        role="tab"
        aria-selected="${isSelected}"
        aria-label="${PROJECTS[project].label}"
        @click=${() => onTabSelected(project)}
      >
        ${PROJECTS[project].icon(isSelected)}
        <div class="${classes('icon-tab__caption')}">
          ${shortLabel(project)}
        </div>
      </button>
    `;
  });

  const options = tabs.map(project => ({
    value: project,
    label: PROJECTS[project].label,
    iconFileName: PROJECTS[project].iconFileName,
  }));

  return html`
    <div class="icon-tab-bar" role="tablist">${iconTabs}</div>
    <div class="icon-dropdown">
      ${select({
        id: 'project-selector',
        ariaLabel: 'Project',
        required: true,
        currentValue: selectedTab,
        options,
        iconLibrary: RA_ICON_LIBRARY,
        onChange: event =>
          onTabSelected((event.target as HTMLInputElement).value as Project),
      })}
    </div>
  `;
};
