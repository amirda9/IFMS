import {FC, ReactNode} from 'react';
import {SimpleBtn} from '~/components';

type Props = {
  onSaveButtonClick?: () => void;
  onResetButtonClick?: () => void;
  children?: ReactNode;
};

const SystemSettingsMain: FC<Props> = ({
  onSaveButtonClick,
  onResetButtonClick,
  children,
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex-grow">{children}</div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={onSaveButtonClick}>Save</SimpleBtn>
        <SimpleBtn onClick={onResetButtonClick}>Reset to Default</SimpleBtn>
        <SimpleBtn link to="..">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default SystemSettingsMain;
