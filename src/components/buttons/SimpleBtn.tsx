import React, {FC, ReactNode} from 'react';
import {Link} from 'react-router-dom';
import classNames from '~/util/classNames';

type PropsType = {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  link?: boolean;
  to?: string;
  children?: ReactNode;
  type?: 'button' | 'submit' | 'reset';
};

const styles =
  'w-fit rounded-md bg-gradient-to-b from-[#BAC2EDB0] to-[#B3BDF2] px-7 py-1 text-sm active:opacity-50 disabled:pointer-events-none';
const SimpleBtn: FC<PropsType> = ({
  className,
  link,
  to = '#',
  disabled,
  loading,
  loadingText,
  ...props
}) => {
  if (link) {
    return (
      <Link
        to={to}
        className={classNames(
          styles,
          className,
          disabled && 'pointer-events-none bg-gray-700',
        )}
        {...props}
      />
    );
  }
  return (
    <button
      type="button"
      className={classNames(
        styles,
        className,
        disabled && 'pointer-events-none bg-gray-700',
      )}
      {...props}
      disabled={disabled || loading}>
      {loading ? loadingText || 'Please wait...' : props.children}
    </button>
  );
};

export default SimpleBtn;
