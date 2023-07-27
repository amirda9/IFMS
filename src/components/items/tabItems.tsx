import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';

type PropsType = {
  to: string;
  name: string;
};
const TabItems: FC<PropsType> = ({to, name}) => {
  return (
    <NavLink
      className={({isActive}) =>
        `flex flex h-8 w-20  items-center justify-center text-sm ${
          isActive ? 'bg-p text-white' : 'bg-blue-200'
        }`
      }
      to={to}
      end>
      {name}
    </NavLink>
  );
};

export default TabItems;
