import React, {FC} from 'react';
import {NavLink, Link} from 'react-router-dom';
import {IoChevronDown, IoChevronUp} from 'react-icons/io5';
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
    <div className="flex flex-col first:[&_a]:rounded-tl-md first:[&_a]:rounded-tr-md last:[&_a]:rounded-bl-md last:[&_a]:rounded-br-md">
      {items?.map(item =>
        item.to && !item.handelSelf ? (
          <NavLink
            to={item.to}
            key={item.label}
            className={({isActive}) =>
              `whitespace-nowrap break-keep border-b p-4 text-black last:border-none active:opacity-50 ${
                isActive ? 'bg-blueLight' : ''
              }`
            }>
            {item.label}
          </NavLink>
        ) : (
          <button
            onClick={() => onClick?.(item.label)}
            key={item.label}
            className="whitespace-nowrap break-keep border-b p-4 text-black last:border-none active:opacity-50">
            {item.label}
          </button>
        ),
      )}
    </div>
  );
  return (
    <div
      className={`relative mr-10 flex h-full items-center justify-center text-center [&_.close]:hover:hidden [&_.open]:hover:block [&_ul]:hover:flex  ${className}`}>
      <Link to={to} className="flex flex-row items-center text-white">
        {Icon ? <Icon className="mr-2 text-xl" /> : null}
        <span>{name}</span>
        <IoChevronDown className="close ml-2" />
        <IoChevronUp className="open ml-2 hidden" />
      </Link>
      <ul className="absolute  top-full hidden w-fit -translate-y-4 rounded-md bg-white">
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
