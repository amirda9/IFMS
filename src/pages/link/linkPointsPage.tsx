import React from 'react';
import {SimpleBtn, TextInput} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';
import {useSelector} from 'react-redux';
import { BsPlusLg } from 'react-icons/bs';
type Iprops = {
  classname: string;
  onclick: Function;
};
const Addbox = ({classname, onclick}: Iprops) => {
  return (
    <div
      className={`flex flex-row items-center justify-between opacity-0  hover:opacity-100  ${classname}`}>
      <button
        onClick={() => onclick()}
        className="mr-[3px] h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[15px] bg-[#32C65D]">
        <BsPlusLg color="white" size={35} className="ml-[-2.5px] mt-[-2.5px]" />
      </button>
      <div className="w-[calc(100%-40px)]  border-t-[2px] border-dashed  border-[#32C65D]"></div>
    </div>
  );
};
const LinkPointsPage = () => {
  const {linkDetail} = useSelector((state: any) => state.http);
  console.log(linkDetail?.data?.access, 'fffrrtttt');
  const buttons = (
    <>
      {linkDetail?.data?.access == 'ADMIN' ? (
        <SimpleBtn type="submit">Save</SimpleBtn>
      ) : null}
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      {[...new Array(7)].map((_, index) => (
        <div className="my-4 flex w-[677px] relative flex-row  items-center justify-between rounded-md bg-gis p-4">
          <span>{index + 1}</span>
          <TextInput  className='w-[246px]'/>
          <TextInput  className='w-[246px]'/>
          <IoTrashOutline
            size={24}
            className="cursor-pointer  text-red-500  active:text-red-300"
          />
          <Addbox classname={'absolute z-50 left-[-25px] w-full bottom-[-22.5px] h-[30px]'} onclick={()=>{}} />
        </div>
      ))}
    </FormLayout>
  );
};

export default LinkPointsPage;
