import React, {FC, ReactNode} from 'react';
import classNames from '~/util/classNames';

type PropsType = {
  label: string;
  children: ReactNode;
  items?: 'center' | 'start' | 'end';
  className?: string;
  labelClassName?: string;
};
const Description: FC<PropsType> = ({
  label,
  children,
  items = 'center',
  className,
  labelClassName,
}) => {
  return (
    <div
      className={classNames(
        `items-${items}`,
        'flex flex-row',
        className,
      )}>
      <label className={classNames('w-40 text-sm', labelClassName)}>
        {label}
      </label>
      {typeof children === 'string' ? (
        <span className="text-sm">{children}</span>
      ) : (
        children
      )}
    </div>
  );
};

export default Description;
