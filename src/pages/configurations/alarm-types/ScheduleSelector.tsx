import {FC} from 'react';
import {Select} from '~/components';
import classNames from '~/util/classNames';

type Props = {
  label: string;
  hasCheckbox?: boolean;
  className?: string;
  selectsClassName?: string;
};

const ScheduleSelector: FC<Props> = ({
  label,
  hasCheckbox = true,
  className,
  selectsClassName,
}) => {
  return (
    <div className={classNames('flex items-center', className)}>
      {hasCheckbox && (
        <span className="mr-2">
          <input type="checkbox" />
        </span>
      )}

      <span className="flex-grow">{label}</span>

      <div className="flex flex-row justify-between gap-x-8">
        <Select className={classNames('w-16', selectsClassName)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Select>
        <Select className={classNames('w-16', selectsClassName)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Select>
        <Select className={classNames('w-16', selectsClassName)}>
          <option>0</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
        </Select>
      </div>
    </div>
  );
};

export default ScheduleSelector;
