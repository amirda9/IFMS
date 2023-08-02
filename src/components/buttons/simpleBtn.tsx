import React, {FC, ReactNode} from 'react';
import {Link} from 'react-router-dom';

type PropsType = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  link?: boolean;
  to?: string;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
};

const classNames =
  'w-fit rounded-md bg-gradient-to-b from-[#BAC2EDB0] to-[#B3BDF2] px-7 py-1 text-sm active:opacity-50 disabled:pointer-events-none';
const SimpleBtn: FC<PropsType> = ({
  className,
  link,
  to = '#',
  disabled,
  ...props
}) => {
  if (link) {
    return (
      <Link
        to={to}
        className={`${classNames} ${className} ${
          disabled ? 'pointer-events-none bg-gray-700' : ''
        }`}
        {...props}
      />
    );
  }
  return (
    <button
      type="button"
      className={`${classNames} ${className} ${
        disabled ? 'pointer-events-none bg-gray-700' : ''
      }`}
      {...props}
    />
  );
};

export default SimpleBtn;
