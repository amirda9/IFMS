import {FC} from 'react';
import SimpleBtn from './simpleBtn';
import {TallArrow} from '../icons';

type Props = {
  leftButtonText?: string;
  rightButtonText?: string;
  onClickRightButton?: () => void; // TODO: Probably the () => void signature is not the best to choose. We might need to use the click callback event type for this prop and the SimpleBtn component
  onClickLeftButton?: () => void;
};

const DoubleSideButtonGroup: FC<Props> = ({
  leftButtonText = 'Remove',
  rightButtonText = 'Add',
  onClickLeftButton,
  onClickRightButton,
}) => {
  return (
    <div className="flex flex-col items-center">
      <SimpleBtn className="!w-28" onClick={onClickRightButton}>
        {rightButtonText}
      </SimpleBtn>
      <TallArrow className="mt-7" />
      <TallArrow className="mb-7 mt-14 rotate-180" />
      <SimpleBtn className="!w-28" onClick={onClickLeftButton}>
        {leftButtonText}
      </SimpleBtn>
    </div>
  );
};

export default DoubleSideButtonGroup;
