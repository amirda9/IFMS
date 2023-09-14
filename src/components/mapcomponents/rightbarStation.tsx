import React, {useState} from 'react';
import noRed from '~/assets/icons/noRed.png';
import noOrange from '~/assets/icons/noOrange.png';
import noYellow from '~/assets/icons/noYellow.png';
function RightbarStation() {
  return (
    <div
      className={` to-0 absolute right-0 z-[500] box-border flex h-[100vh]
    w-[330px] flex-col overflow-hidden bg-[#E7EFF7] px-[10px]`}>
      <span className="mb-[40px] mt-[15px] text-[24px] font-bold leading-[29.05px] text-[#636363]">
        Station2
      </span>
      <div className="flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Region
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          Region1
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Latitude
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          35.4
        </span>
      </div>
      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
        Longitude
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          35.4
        </span>
      </div>
      <span className="mb-[10px] mt-[15px] text-[20px] font-light leading-[25.2px] text-[black]">
        RTU List
      </span>
      <div className="mx-auto ml-[5px] flex h-[350px] w-[290px] flex-col overflow-y-auto bg-[#ffffff] px-4">
        <span className="mb-[10px] mt-[15px] text-[20px] font-light leading-[25.2px] text-[black]">
          Ario4P1310S11
        </span>
        <span className="mb-[10px] mt-[15px] text-[20px] font-light leading-[25.2px] text-[black]">
          Ario4P1310S11
        </span>
      </div>
      <span className="mb-[10px] mt-[15px] text-[20px] font-light leading-[25.2px] text-[black]">
        Alarms
      </span>

      <div className="flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={noRed} alt="" className="h-[40px] w-[40px]" />
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          1
        </span>
      </div>

      <div className="mt-[10px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={noOrange} alt="" className="h-[40px] w-[40px]" />
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          1
        </span>
      </div>

      <div className="mt-[10px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={noYellow} alt="" className="h-[40px] w-[40px]" />
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          0
        </span>
      </div>
      <button className="mt-[30px] h-[40px] w-[290px] rounded-[10px] bg-gradient-to-b from-[#BAC2ED]  to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
        Edit Station
      </button>
    </div>
  );
}

export default RightbarStation;
