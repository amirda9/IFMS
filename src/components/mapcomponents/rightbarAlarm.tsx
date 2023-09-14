import React, {useState} from 'react';
import noRed from '~/assets/icons/noRed.png';
import noOrange from '~/assets/icons/noOrange.png';
import noYellow from '~/assets/icons/noYellow.png';
function RightbarAlarm() {
  return (
    <div
      className={` to-0 absolute right-0 z-[500] box-border flex h-[100vh]
    w-[330px] flex-col overflow-hidden bg-[#E7EFF7] px-[20px]`}>
      <span className="mb-[40px] mt-[15px] text-[24px] font-bold leading-[29.05px] text-[#636363]">
        Alarm
      </span>
      <div className="flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Source
        </span>
        <span className="ml-[50px] text-[20px] font-light leading-[25.2px] text-[black]">
          Ario4P1310S11
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Type
        </span>
        <span className="ml-[72px] text-[20px] font-light leading-[25.2px] text-[black]">
          Fiber Fault
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Time
        </span>
        <span className="ml-[72px] text-[20px] font-light leading-[25.2px] text-[black]">
          2023-05-28 19:41:39
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Severity
        </span>
        <span className="ml-[47px] text-[20px] font-light leading-[25.2px] text-[black]">
          Mediumt
        </span>
      </div>

      <div className="mt-[20px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          State
        </span>
        <span className="ml-[75px] text-[20px] font-light leading-[25.2px] text-[black]">
          In Progress
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          Modified
        </span>
        <span className="ml-[45px] text-[20px] font-light leading-[25.2px] text-[black]">
          2023-05-29 19:49:39
        </span>
      </div>

      <div className="mt-[15px] flex w-auto flex-row items-center">
        <span className="text-[20px] font-light leading-[25.2px] text-[black]">
          User
        </span>
        <span className="ml-[84px] text-[20px] font-light leading-[25.2px] text-[black]">
          Ahmad Kazemi
        </span>
      </div>

      <button className="mx-auto mt-[390px] h-[40px] w-[290px] rounded-[10px] bg-gradient-to-b  from-[#BAC2ED] to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
      Edit Alarm
      </button>
    </div>
  );
}

export default RightbarAlarm;
