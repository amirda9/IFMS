import React, {FC, useState} from 'react';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import {matchPath} from 'react-router';
import {IoTrashOutline} from 'react-icons/io5';
import classNames from '~/util/classNames';
import Checkbox from '../checkbox/checkbox';
import {BsPlusLg} from 'react-icons/bs';

type PropsType = {
  name: string;
  to: string;
  onDelete?: () => void;
  disabled?: boolean;
  className?: string;
  enabelcheck?: boolean;
  checkstatus?: boolean;
  onclickcheckbox?: (e: boolean) => void;
  onclick?: () => void;
  selected?: boolean;
  canAdd?: boolean;
  createurl?:string
};

const SidebarItem: FC<PropsType> = ({
  to,
  name,
  onDelete,
  disabled,
  className,
  enabelcheck = false,
  checkstatus = false,
  onclickcheckbox = () => {},
  onclick = () => {},
  selected = false,
  canAdd = false,
  createurl=""
}) => {
  const location = useLocation(); // get the current location
  // check if the current location matches the to prop
  const match = matchPath(to, location.pathname);

  var result = location.pathname.search(to);
 const navigate=useNavigate()
  return (
    <div className={'relative my-1 flex flex-row ' + className}>
      <NavLink
        onClick={() => {
          onclick();
        }}
        to={to}
        className={({isActive}) =>
          ` flex h-10 flex-grow items-center rounded-lg ${
            enabelcheck ? 'pl-[30px]' : 'pl-[5px]'
          } ${isActive ? 'bg-cyan-200' : ''}`
        }>
        {name}
      </NavLink>
      {enabelcheck ? (
        <Checkbox
          checkstatus={checkstatus}
          onclick={e => onclickcheckbox(e)}
          iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
          classname={
            'absolute z-10 left-[4px] top-[4.5px] w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
          }
        />
      ) : null}

      {canAdd && result > -1 && selected ? (
        <BsPlusLg
          onClick={
            
             ()=>navigate(createurl)
          }
          color="#18C047"
          size={25}
          className="absolute right-[27px] top-[15px] mt-[-6px] cursor-pointer"
        />
      ) : null}

      {onDelete && result > -1 && selected ? (
        <button
          className={`ml-[-4px] rounded-r-lg px-[4px] ${
            result > -1 ? 'bg-cyan-200' : 'white'
          } `}
          onClick={onDelete}>
          <IoTrashOutline
            size={24}
            className={classNames(
              disabled ? 'pointer-events-none text-gray-500 ' : 'text-red-500',
              'active:text-red-300',
            )}
          />
        </button>
      ) : null}
    </div>
  );
};

export default SidebarItem;
