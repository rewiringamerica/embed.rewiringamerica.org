import { FC } from 'react';
import { TextButton } from '../components/buttons';
import { EditIcon } from '../components/icons';
import { useTranslated } from '../i18n/use-translated';
import { RemFormLabels } from './RemForm';

export const RemFormSnapshot: FC<{
  formLabels: RemFormLabels;
  upgradeLabel: string;
  onEdit: () => void;
}> = ({ formLabels, upgradeLabel, onEdit }) => {
  const { msg } = useTranslated();

  return (
    <div className="flex flex-col gap-3 p-4 pb-3 bg-white">
      <div className="flex justify-between">
        <h2 className="text-base font-medium leading-normal">
          {msg('Your household info')}
        </h2>
        <TextButton onClick={onEdit}>
          <div className="flex items-center gap-1.5">
            <EditIcon w={16} h={16} />
            {msg('Edit')}
          </div>
        </TextButton>
      </div>
      <ul className="text-sm leading-normal">
        <li>
          <span className="font-medium">{msg('Household type')}:</span>{' '}
          {formLabels.buildingType}
        </li>
        <li>
          <span className="font-medium">{msg('Address')}:</span>{' '}
          {formLabels.address}
        </li>
        <li>
          <span className="font-medium">{msg('Heating fuel')}:</span>{' '}
          {formLabels.heatingFuel}
        </li>
        {formLabels.waterHeatingFuel && (
          <li>
            <span className="font-medium">{msg('Water heating fuel')}:</span>{' '}
            {formLabels.waterHeatingFuel}
          </li>
        )}
      </ul>
      <div className="h-px bg-grey-200">{/* separator */}</div>
      <div className="font-medium leading-normal">
        {msg('Selected upgrade')}
      </div>
      <div className="rounded p-2 leading-normal text-grey-900 border border-purple-200 bg-purple-100">
        {upgradeLabel}
      </div>
    </div>
  );
};
