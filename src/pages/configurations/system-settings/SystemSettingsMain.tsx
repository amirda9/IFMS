import {FC, ReactNode} from 'react';
import {SimpleBtn} from '~/components';
import classNames from '~/util/classNames';

type Props = {
  onSaveButtonClick?: () => void;
  onResetButtonClick?: () => void;
  children?: ReactNode;
  contentClassName?: string;
};

const SystemSettingsMain: FC<Props> = ({
  onSaveButtonClick,
  onResetButtonClick,
  children,
  contentClassName
}) => {
  return (
    <div className="flex flex-col w-full h-full overflow-auto">
      <div className={classNames("flex-1", contentClassName)}>{children}</div>
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
