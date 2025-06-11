import { FC } from 'react';
import { TextButton } from '../components/buttons';
import { EditIcon } from '../components/icons';
import { useTranslated } from '../i18n/use-translated';
import { RemFormLabels } from './form';

export const RemFormSnapshot: FC<{
  formLabels: RemFormLabels;
  onEdit: () => void;
}> = ({ formLabels, onEdit }) => {
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
            Edit
          </div>
        </TextButton>
      </div>
      <ul className="text-sm leading-normal">
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
    </div>
  );
};
