import { css, html } from 'lit';
import { PROJECTS, Project, shortLabel } from './projects';
import { select } from './select';

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

  button.icon-tab {
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

    & .caption {
      color: var(--color-purple-500, #4a00c3);
      font-size: 1rem;
      font-weight: 500;
      line-height: 125%;
      white-space: nowrap;
    }
  }

  button.icon-tab--selected {
    cursor: default;

    background: var(--color-purple-500, #4a00c3);
    border-color: var(--color-purple-500, #4a00c3);

    & .caption {
      color: white;
    }
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

export const iconTabBarTemplate = (
  tabs: Project[],
  selectedTab: Project,
  onTabSelected: (newSelection: Project) => void,
) => {
  const iconTabs = tabs.map(project => {
    const color = project === selectedTab ? 'white' : '#4a00c3';
    const selectedClass = project === selectedTab ? 'icon-tab--selected' : '';
    return html`
      <button
        class="icon-tab ${selectedClass}"
        @click=${() => onTabSelected(project)}
      >
        ${PROJECTS[project].icon(color)}
        <div class="caption">${shortLabel(project)}</div>
      </button>
    `;
  });

  const options = tabs.map(project => ({
    value: project,
    label: PROJECTS[project].label,
  }));

  return html`
    <div class="icon-tab-bar">${iconTabs}</div>
    <div class="icon-dropdown">
      ${select({
        id: 'project-selector',
        required: true,
        currentValue: selectedTab,
        options,
        onChange: event =>
          onTabSelected((event.target as HTMLInputElement).value as Project),
        ariaLabel: 'Project',
      })}
    </div>
  `;
};
