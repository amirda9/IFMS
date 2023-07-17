import React, { FC } from 'react'
import { NavLink } from 'react-router-dom'

type PropsType = {
  name: string;
  to: string;
  onDelete?: () => void;

}
const NetworkItem: FC<PropsType> = ({ to, name }) => {
  return (
    <div className={'flex flex-row'}>
      <NavLink to={to} className={
        ({ isActive }) => `flex-grow h-10 flex items-center pl-2 rounded-lg ${isActive ? 'bg-cyan-200' : ''}`
      }>{name}</NavLink>
      <button className={"ml-4"}>trash</button>
    </div>
  )
}

export default NetworkItem
