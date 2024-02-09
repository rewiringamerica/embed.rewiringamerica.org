import clsx from 'clsx';
import { FC } from 'react';
import { Option, Select } from './components/select';
import { useTranslated } from './i18n/use-translated';
import { PROJECTS, Project, shortLabel } from './projects';

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
  const { msg } = useTranslated();
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
          isSelected &&
            'cursor-default text-white bg-purple-500 border-purple-500',
          !isSelected &&
            'cursor-pointer text-purple-500 bg-transparent border-grey-300',
        )}
        role="tab"
        aria-selected={isSelected}
        aria-label={PROJECTS[project].label(msg)}
        onClick={() => onTabSelected(project)}
      >
        <span className="text-lg">
          {PROJECTS[project].getIcon() /* 20px */}
        </span>
        <div className="text-base leading-tight font-medium whitespace-nowrap">
          {shortLabel(project, msg)}
        </div>
      </button>
    );
  });

  const options: Option<Project>[] = tabs.map(project => ({
    value: project,
    label: PROJECTS[project].label(msg),
    getIcon: PROJECTS[project].getIcon,
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
          labelText={msg('Project', { desc: 'label for a selector input' })}
          hiddenLabel={true}
          multiple={false}
          currentValue={selectedTab}
          options={options}
          onChange={project => onTabSelected(project)}
        />
      </div>
    </>
  );
};
