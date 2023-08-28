import React, {FC, ReactNode} from 'react';
import {TextInput} from '~/components';
import {Link, Outlet} from 'react-router-dom';
import {IoAddOutline} from 'react-icons/io5';

type PropsType = {
  children: ReactNode;
  createTitle?: string;
  searchOnChange?: (text: string) => void;
  canAdd?: boolean;
  addButtonLink?: string;
};
const SidebarLayout: FC<PropsType> = ({
  children,
  createTitle,
  searchOnChange,
  canAdd,
  addButtonLink,
}) => {
  return (
    <>
      <div className="flex w-1/4 flex-col border-r-2 border-g p-4">
        {searchOnChange ? (
          <div className="flex flex-row items-center">
            <label htmlFor="search" className="mr-2">
              Search
            </label>

            <TextInput
              id="search"
              className="mr-10 w-full"
              onChange={event => {
                searchOnChange(event.target.value);
              }}
            />
          </div>
        ) : null}

        {createTitle ? (
          <div className="ml-[-10px] mt-14 flex w-fit flex-row items-center rounded-md px-3 py-2">
            <span className="text-md font-semibold">{createTitle}</span>
            {canAdd ? (
              <Link to={addButtonLink || 'create'} className="ml-3 rounded-md">
                <IoAddOutline className="text-2xl text-green-500 active:text-green-300" />
              </Link>
            ) : null}
          </div>
        ) : null}

        <div className="mt-2">{children}</div>
      </div>
      <div className="flex w-full p-4">
        <Outlet />
      </div>
    </>
  );
};

export default SidebarLayout;
