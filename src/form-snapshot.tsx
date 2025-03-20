import { TextButton } from './buttons';
import { useTranslated } from './i18n/use-translated';
import { EditIcon } from './icons';
import { Project, PROJECTS } from './projects';
import { FormLabels } from './state-calculator-form';

type Props = {
  formLabels: FormLabels;
  totalResults: number;
  countOfProjects: number;
  singleProject: Project | null;
  onEditClicked: () => void;
};

/**
 * The component that displays a non-editable listing of the values you
 * submitted in the form, with a button to go back to editing the form.
 */
export const FormSnapshot: React.FC<Props> = ({
  formLabels,
  totalResults,
  countOfProjects,
  singleProject,
  onEditClicked,
}) => {
  const { msg } = useTranslated();

  let title: string;
  if (singleProject) {
    const projectLabel = PROJECTS[singleProject].label(msg).toLowerCase();
    title = `We found ${totalResults} savings programs for ${projectLabel},`;
  } else {
    title = `We found ${totalResults} savings programs across ${countOfProjects} projects,`;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="leading-normal text-color-text-primary">
        <span className="font-medium">{msg(title)}</span>{' '}
        {msg('based on your household information.', {
          desc: 'preceded by "we found N projects"',
        })}
      </div>
      <ul className="text-sm text-grey-600 leading-normal">
        <li>
          <span className="font-medium">
            {msg('Rent or own', { desc: 'form field label' })}:
          </span>{' '}
          {formLabels.ownerStatus}
        </li>
        <li>
          <span className="font-medium">{msg('ZIP code')}:</span>{' '}
          {formLabels.zip}
        </li>
        <li>
          <span className="font-medium">
            {msg('Electric utility', { desc: 'as in utility company' })}:
          </span>{' '}
          {formLabels.utility}
        </li>
        {formLabels.gasUtility && (
          <li>
            <span className="font-medium">
              {msg('Gas utility', { desc: 'as in utility company' })}:
            </span>{' '}
            {formLabels.gasUtility}
          </li>
        )}
        <li>
          <span className="font-medium">{msg('Household income')}:</span>{' '}
          {formLabels.householdIncome}
        </li>
        <li>
          <span className="font-medium">
            {msg('Tax filing status', { desc: 'form field label' })}:
          </span>{' '}
          {formLabels.taxFiling}
        </li>
        <li>
          <span className="font-medium">{msg('Household size')}:</span>{' '}
          {formLabels.householdSize}
        </li>
      </ul>
      <TextButton onClick={onEditClicked}>
        <div className="flex items-center gap-1.5">
          <EditIcon w={16} h={16} />
          Edit household info
        </div>
      </TextButton>
    </div>
  );
};
