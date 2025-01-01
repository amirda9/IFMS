import React, {FC} from 'react';
import {NavLink, useLocation} from 'react-router-dom';

type PropsType = {
  to: string;
  name: string;
  className?: string;
  onClick?: () => void;
  activelink?: string;
};
const TabItems: FC<PropsType> = ({
  to,
  name,
  className,
  onClick,
  activelink
  
}) => {
  const location = useLocation();
  if (onClick) {
    const isactivebtn = location.pathname == activelink
    return (
      <button
        className={`flex w-auto h-8 items-center justify-center px-3 text-sm ${
          isactivebtn ? 'bg-p text-white' : 'bg-blue-200'
        } ${className}`}
        onClick={onClick}>
          {name}
        </button>
    );
  } else {
    return (
      <NavLink
        className={({isActive}) =>
          `flex h-8 items-center justify-center px-3 text-sm ${
            isActive ? 'bg-p text-white' : 'bg-blue-200'
          } ${className}`
        }
        to={to}
        end>
        {name}
      </NavLink>
    );
  }
};

export default TabItems;
