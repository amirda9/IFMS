import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {IoChevronDown} from 'react-icons/io5';
import {IconType} from 'react-icons';

type PropsType = {
  name: string;
  to: string;
  className?: string;
  items?: Array<{label: string; to?: string; handelSelf?: boolean}>;
  onClick?: (label: string) => void;
  icon?: IconType;
};
const NavItems: FC<PropsType> = ({
  to,
  name,
  className,
  items,
  onClick,
  icon: Icon,
}) => {
  const menu = (
    <div className="flex flex-col ">
      {items?.map(item =>
        item.to && !item.handelSelf ? (
          <Link
            to={item.to}
            key={item.label}
            className="border-b p-4 text-black last:border-none active:opacity-50">
            {item.label}
          </Link>
        ) : (
          <button
            onClick={() => onClick?.(item.label)}
            key={item.label}
            className="border-b p-4 text-black last:border-none active:opacity-50">
            {item.label}
          </button>
        ),
      )}
    </div>
  );
  return (
    <div
      className={
        'relative mr-10 flex h-full items-center text-center [&_ul]:hover:flex ' +
        className
      }>
      <Link to={to} className="flex flex-row items-center text-white">
        {Icon ? <Icon className="mr-2 text-xl" /> : null}
        <span>{name}</span>
        <IoChevronDown className="ml-2" />
      </Link>
      <ul className="absolute right-0 top-full hidden w-fit -translate-y-4 rounded-md bg-white">
        {!items || !items.length ? (
          <span className="break-keep p-4 text-black">Not set any item</span>
        ) : (
          menu
        )}
      </ul>
    </div>
  );
};

export default NavItems;
