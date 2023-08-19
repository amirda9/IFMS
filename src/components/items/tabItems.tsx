import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';

type PropsType = {
  to: string;
  name: string;
  className?: string;
};
const TabItems: FC<PropsType> = ({to, name, className}) => {
  return (
    <NavLink
      className={({isActive}) =>
        `flex h-8 px-3 items-center justify-center text-sm ${
          isActive ? 'bg-p text-white' : 'bg-blue-200'
        } ${className}`
      }
      to={to}
      end>
      {name}
    </NavLink>
  );
};

export default TabItems;
