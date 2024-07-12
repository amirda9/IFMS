import React, { useEffect, useState } from 'react';
import {SimpleBtn, TextInput} from '~/components';
import { $Get } from '~/util/requestapi';
const AlarmRow = ({
  title,
  data,
  onchange,
}: {
  title: string;
  data: string;
  onchange?: () => void;
}) => {
  return (
    <div className="mt-8 flex flex-row items-center justify-between">
      <span className="text-[20px]  font-normal leading-[24.2px]">{title}</span>
      <TextInput
        defaultValue={data}
        className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
      />
    </div>
  );
};
function AlarmAlarmsPage() {
  // const [limit,setLimit]=useState()
  // const getallAlarms=async()=>{
  //   const response=await $Get(`otdr/alarm/events/?limit=2`)
  // }
  // useEffect(()=>{

  // },[])
  return (
    <div className="w-full px-6 pt-4 pb-8">
      <div className="flex w-full flex-row justify-between rounded-[10px]  bg-[#C0E7F2] p-8 pt-[0px]">
        <div className="w-[46%]">
          <AlarmRow title="Secondary Source" data="Core" />
          <div className="mt-8 w-full text-center text-[20px] font-normal leading-[24.2px]">
            Alarm Detail
          </div>
          <AlarmRow title="Region Name" data="Region 1" />
          <AlarmRow title="Region Admin" data="Ahmad Kazemi" />
          <AlarmRow title="Station Name" data="Station 1" />
          <AlarmRow title="To Escalation" data="1 Day - 2 Hours - 23 Minutes" />
          <AlarmRow title="To Time Out" data="1 Day - 2 Hours - 23 Minutes" />
        </div>

        <div className="flex w-[46%]  flex-col">
          <AlarmRow title="State" data="In Progress" />
          <div className="ml-[80px]  w-[calc(100%-80px)]">
            <div className="mt-8 flex w-full flex-row justify-between">
              <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
                Parameter
              </div>
              <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
                Value
              </div>
            </div>

            <div className="mt-8 flex w-full flex-row justify-between">
              <TextInput className="h-[40px] w-[40%]" />
              <TextInput className="h-[40px] w-[50%]" />
            </div>

            <div className="mt-8 flex w-full flex-row justify-between">
              <TextInput className="h-[40px] w-[40%]" />
              <TextInput className="h-[40px] w-[50%]" />
            </div>
            <div className="mt-8 flex w-full flex-row justify-between items-center">
              <TextInput className="h-[40px] w-[40%]" />
              <div className='w-[50%] flex flex-row justify-between'>
              <TextInput className="h-[40px] w-[20%]" />
              <span className='mt-2'>x</span>
              
              <TextInput className="h-[40px] w-[70%]" />
              </div>
              
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-x-4 justify-end mt-8">
        <SimpleBtn type="submit">Save</SimpleBtn>

        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
}

export default AlarmAlarmsPage;
