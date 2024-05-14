import React, {useState} from 'react';
import noRed from '~/assets/icons/noRed.png';
import noOrange from '~/assets/icons/noOrange.png';
import noYellow from '~/assets/icons/noYellow.png';

type linktype={
  data:{
    alarms:any[]
    destination:{id:string, name: string}
    id:string
    length:string
    name:string
    regionId:string
    regionName:string
    source:{id:string, name:string}
  }
  }
function RightbarLink({data}:linktype) {
  return (
    <div
      className={` to-0 absolute right-0 z-[500] box-border flex h-[100vh]
    w-[330px] flex-col overflow-hidden bg-[#E7EFF7] px-[20px]`}>
      <div className='relative w-full h-full'>
      <div className="mb-[40px] mt-[15px] text-[24px] font-bold leading-[29.05px] text-[#636363]">
    {data.name}
      </div>
      <div className="flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Region
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          {data.regionName}
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
        Length
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
        {data.length}
        </span>
      </div>
      
      <div className="mb-[15px] mt-[15px] text-[20px] font-light leading-[25.2px] text-[black]">
        Alarms
      </div>

      <div className="flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={noRed} alt="" className="h-[40px] w-[40px]" />
        </span>
        <span className="ml-[80px] text-[20px] font-light leading-[25.2px] text-[black]">
          1
        </span>
      </div>

      <div className="mt-[10px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={noOrange} alt="" className="h-[40px] w-[40px]" />
        </span>
        <span className="ml-[80px] text-[20px] font-light leading-[25.2px] text-[black]">
          1
        </span>
      </div>

      <div className="mt-[10px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={noYellow} alt="" className="h-[40px] w-[40px]" />
        </span>
        <span className="ml-[80px] text-[20px] font-light leading-[25.2px] text-[black]">
          0
        </span>
      </div>
      <button className="absolute  z-[510] bottom-[110px] 2xl:bottom-[120px] h-[40px] w-[290px] rounded-[10px] bg-gradient-to-b from-[#BAC2ED]  to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black] mx-auto">
        Edit Station
      </button>
      </div>
    </div>
  );
}

export default RightbarLink;
