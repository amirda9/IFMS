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
  contentClassName,
}) => {
  return (
    <div className="flex h-full w-full flex-col overflow-auto">
      <div
        className={classNames(
          'flex flex-1 flex-col gap-y-4',
          contentClassName,
        )}>
        {children}
      </div>
      <div className="flex flex-row gap-x-4 self-end  mt-[40px]">
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
