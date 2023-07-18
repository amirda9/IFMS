import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {IoTrashOutline} from 'react-icons/io5';

type PropsType = {
  name: string;
  to: string;
  onDelete?: () => void;
};
const NetworkItem: FC<PropsType> = ({to, name}) => {
  return (
    <div className="my-1 flex flex-row">
      <NavLink
        to={to}
        className={({isActive}) =>
          `flex h-10 flex-grow items-center rounded-lg pl-2 ${
            isActive ? 'bg-cyan-200' : ''
          }`
        }>
        {name}
      </NavLink>
      <button className="ml-4">
        <IoTrashOutline
          size={24}
          className="text-red-500 active:text-red-300"
        />
      </button>
    </div>
  );
};

export default NetworkItem;
