import {FC, ReactNode, useState} from 'react';
import {TextInput} from '~/components';
import {Link, Outlet} from 'react-router-dom';
import {IoAddOutline} from 'react-icons/io5';

type PropsType = {
  children: ReactNode;
  createTitle?: string;
  searchOnChange?: (text: string) => void;
  canAdd?: boolean;
  addButtonLink?: string;
  hideSidebar?: boolean;
};
const NetworkLayout: FC<PropsType> = ({
  children,
  createTitle,
  searchOnChange,
  canAdd,
  addButtonLink,
  hideSidebar = false,
}) => {
  const [show,setShow]=useState(false)
  return (
    <>
      {!hideSidebar && (
        <div className="flex w-1/4 min-h-[calc(100vh-120px)] overflow-y-auto flex-col border-r-2  border-g p-4">
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
            <div className="ml-[-10px]  mt-14 flex w-fit flex-row items-center rounded-md px-3 py-2 pb-[0px]">
              {show?
               <span onClick={()=>setShow(!show)} className='mr-[5px] mt-[-10px] cursor-pointer'>_</span>
            :
            <span onClick={()=>setShow(!show)} className='mr-[5px] text-[20px] cursor-pointer'>+</span>
            }
             
           
              <button onClick={()=>setShow(!show)} className="text-md font-semibold">{createTitle}</button>
              {canAdd ? (
                <Link
                  to={addButtonLink || 'create'}
                  className="ml-3 rounded-md">
                  <IoAddOutline className="text-2xl text-green-500 active:text-green-300" />
                </Link>
              ) : null}
            </div>
          ) : null}
{show?

<div className="border-l-[1px] border-dashed pt-[20px]  mt-[-6px] ml-[5px]  border-black">{children}</div>
:null}
    
        </div>
      )}
      <div className="flex w-full px-8 py-6">
        <Outlet />
      </div>
    </>
  );
};

export default NetworkLayout;
