import React, {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {IoTrashOutline} from 'react-icons/io5';

type PropsType = {
  name: string;
  to: string;
  onDelete?: () => void;
  disabled?: boolean;
};
const NetworkItem: FC<PropsType> = ({to, name, onDelete, disabled}) => {
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
      <button className="ml-4" onClick={onDelete}>
        <IoTrashOutline
          size={24}
          className={` ${
            disabled ? 'pointer-events-none text-gray-500 ' : 'text-red-500'
          }  active:text-red-300`}
        />
      </button>
    </div>
  );
};

export default NetworkItem;
