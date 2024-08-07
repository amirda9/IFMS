import React, {useState} from 'react';
import noRed from '~/assets/icons/noRed.png';
import noOrange from '~/assets/icons/noOrange.png';
import noYellow from '~/assets/icons/noYellow.png';

type Stationtype = {
  data: {
    rtus: {id: string; name: string}[];
    alarms: any[];
    id: string;
    latitude: number;
    longitude: number;
    name: string;
    regionId?: string;
    regionName?: string;
  };
  Hightalaems: number;
  Lowalarms: number;
  Mediumalarms: number;
};
function RightbarStation({
  data,
  Hightalaems,
  Lowalarms,
  Mediumalarms,
}: Stationtype) {
  console.log('datadatadata', data.rtus);

  return (
    <div
      className={` to-0 absolute right-0 z-[500] box-border flex h-[100vh]
    w-[330px] flex-col overflow-y-auto overflow-x-hidden bg-[#E7EFF7] px-[20px]`}>
      <div className="relative h-full w-full">
        <div className="mb-[15px] mt-[10px] text-[20px] font-bold leading-[29.05px] text-[#636363]">
          {data.name}
        </div>
        <div className="flex w-auto flex-row items-center">
          <span className="text-[18px] font-light leading-[25.2px] text-[black]">
            Region
          </span>
          <span className="ml-[50px] text-[18px] font-light leading-[25.2px] text-[black]">
            {data.regionName}
          </span>
        </div>

        <div className="mt-[15px] flex w-auto flex-row items-center">
          <span className="text-[18px] font-light leading-[25.2px] text-[black]">
            Latitude
          </span>
          <span className="ml-[40px] text-[18px] font-light leading-[25.2px] text-[black]">
            {data.latitude}
          </span>
        </div>
        <div className="mt-[15px] flex w-auto flex-row items-center">
          <span className="text-[18px] font-light leading-[25.2px] text-[black]">
            Longitude
          </span>
          <span className="ml-[25px] text-[18px] font-light leading-[25.2px] text-[black]">
            {data.longitude}
          </span>
        </div>
        <div className="mb-[10px] mt-[15px] text-[18px] font-light leading-[25.2px] text-[black]">
          RTU List
        </div>
        <div className="mx-auto ml-[5px] flex h-[120px] w-[290px] flex-col overflow-y-auto bg-[#ffffff] px-4 2xl:h-[240px]">
          {data?.rtus?.map(rtuedata => (
            <span className="mb-[10px] mt-[15px] text-[18px] font-light leading-[25.2px] text-[black]">
              {rtuedata.name}
            </span>
          ))}
        </div>
        <div className="mb-[10px] mt-[15px] text-[18px] font-light leading-[25.2px] text-[black]">
          Alarms
        </div>

        <div className="flex w-auto flex-row items-center">
          <span className="text-[18px] font-light leading-[25.2px] text-[black]">
            <img
              src={noRed}
              alt=""
              className="h-[30px] w-[30px] 2xl:h-[40px] 2xl:w-[40px]"
            />
          </span>
          <span className="ml-[50px] text-[18px] font-light leading-[25.2px] text-[black]">
            {Hightalaems}
          </span>
        </div>

        <div className="mt-[10px] flex w-auto flex-row items-center">
          <span className="text-[18px] font-light leading-[25.2px] text-[black]">
            <img
              src={noOrange}
              alt=""
              className="h-[30px] w-[30px] 2xl:h-[40px] 2xl:w-[40px]"
            />
          </span>
          <span className="ml-[50px] text-[18px] font-light leading-[25.2px] text-[black]">
            {Lowalarms}
          </span>
        </div>

        <div className="mt-[10px] flex w-auto flex-row items-center">
          <span className="text-[18px] font-light leading-[25.2px] text-[black]">
            <img
              src={noYellow}
              alt=""
              className="h-[30px] w-[30px] 2xl:h-[40px] 2xl:w-[40px]"
            />
          </span>
          <span className="ml-[50px] text-[18px] font-light leading-[25.2px] text-[black]">
            {Mediumalarms}
          </span>
        </div>
        <button className="absolute  z-[510] h-[40px]  w-[290px] rounded-[10px] bg-gradient-to-b from-[#BAC2ED] to-[#B3BDF2]  text-[18px] font-light leading-[25.2px] text-[black] lg:bottom-[110px]">
          Edit Station
        </button>
      </div>
    </div>
  );
}

export default RightbarStation;
