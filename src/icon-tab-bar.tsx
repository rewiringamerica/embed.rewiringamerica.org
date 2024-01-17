import { msg } from '@lit/localize';
import SlIcon from '@shoelace-style/shoelace/dist/react/icon';
import clsx from 'clsx';
import { FC } from 'react';
import { PROJECTS, Project, shortLabel } from './projects';
import { OptionParam, Select } from './select';

type Props = {
  tabs: Project[];
  selectedTab: Project;
  onTabSelected: (newSelection: Project) => void;
};

/**
 * On medium and large layouts, this is a horizontally flowed row of pill-shaped
 * buttons, with icon and text, representing projects. Clicking one selects that
 * single project. The pills can flow onto multiple lines.
 *
 * On small layouts, this is a single-select dropdown.
 */
export const IconTabBar: FC<Props> = ({ tabs, selectedTab, onTabSelected }) => {
  const iconTabs = tabs.map(project => {
    const isSelected = project === selectedTab;
    return (
      <button
        key={project}
        className={clsx(
          'min-w-24',
          'h-12',
          'border',
          'rounded-3xl',
          'px-4',
          'py-3',
          'flex',
          'gap-2',
          'items-center',
          'justify-center',
          isSelected
            ? [
                'cursor-default',
                'text-white',
                'bg-purple-500',
                'border-purple-500',
              ]
            : [
                'cursor-pointer',
                'text-purple-500',
                'bg-transparent',
                'border-grey-300',
              ],
        )}
        role="tab"
        aria-selected={isSelected}
        aria-label={PROJECTS[project].label()}
        onClick={() => onTabSelected(project)}
      >
        <SlIcon
          className="text-lg" // 20px
          src={PROJECTS[project].iconURL.toString()}
        ></SlIcon>
        <div className="text-base leading-tight font-medium whitespace-nowrap">
          {shortLabel(project)}
        </div>
      </button>
    );
  });

  const options: OptionParam<Project>[] = tabs.map(project => ({
    value: project,
    label: PROJECTS[project].label(),
    iconURL: PROJECTS[project].iconURL,
  }));

  return (
    <>
      <div
        className="hidden sm:flex flex-wrap gap-4 justify-center w-5/6 mx-auto mb-6"
        role="tablist"
      >
        {iconTabs}
      </div>
      <div className="sm:hidden mb-6">
        <Select
          id="project-selector"
          aria-label={msg('Project', { desc: 'label for a selector input' })}
          currentValue={selectedTab}
          options={options}
          onChange={project => onTabSelected(project)}
        />
      </div>
    </>
  );
};
