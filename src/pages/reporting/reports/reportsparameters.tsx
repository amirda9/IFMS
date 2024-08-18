import { useState } from 'react';
import {FaArrowUp} from 'react-icons/fa6';
import GreaterThan from '~/assets/icons/Greater Than.png';
import {SimpleBtn} from '~/components';
type itemprops = {
  selected: boolean;
  name: string;
  onclick:()=>void
};

const list = [
  { Network: ["Regions", "Stations", "Optical Routes", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Affected Regions", "Affected Stations", "Occupied Ports", "Free Ports", "Avg. Region Stations", "Max. Region Stations", "Min. Region Stations", "Avg. Region Links", "Max. Region Links", "Min. Region Links", "Avg. Region RTUs", "Max. Region RTUs", "Min. Region RTUs", "Avg. Region Online RTUs", "Max. Region Online RTUs", "Min. Region Online RTUs", "Avg. Region Offline RTUs", "Max. Region Offline RTUs", "Min. Region Offline RTUs"] },
  { Region: ["Stations", "Links", "RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Occupied Ports", "Free Ports", "Avg. Station RTUs", "Max. Station RTUs", "Min. Station RTUs", "Avg. Station RTU Ports", "Max. Station RTU Ports", "Min. Station RTU Ports", "Avg. Station RTU Occupied Ports", "Max. Station RTU Occupied Ports", "Min. Station RTU Occupied Ports", "Avg. Station RTU Free Ports", "Max. Station RTU Free Ports", "Min. Station RTU Free Ports", "Avg. Station Tests", "Max. Station Tests", "Min. Station Tests", "Avg. Station Successful Tests", "Max. Station Successful Tests", "Min. Station Successful Tests", "Avg. Station Failed Tests", "Max. Station Failed Tests", "Min. Station Failed Tests"] },
  { Station: ["RTUs", "Online RTUs", "Offline RTUs", "Tests", "Alarms", "Acknowledged Alarms", "In Progress Alarms", "Resolved Alarms", "Escalated Alarms", "Timed Out Alarms", "Occupied Ports", "Free Ports", "Avg. RTU Ports", "Max. RTU Ports", "Min. RTU Ports", "Avg. RTU Occupied Ports", "Max. RTU Occupied Ports", "Min. RTU Occupied Ports", "Avg. RTU Free Ports", "Max. RTU Free Ports", "Min. RTU Free Ports", "Avg. RTU Tests", "Max. RTU Tests", "Min. RTU Tests", "Avg. RTU Successful Tests", "Max. RTU Successful Tests", "Min. RTU Successful Tests", "Avg. RTU Failed Tests", "Max. RTU Failed Tests", "Min. RTU Failed Tests"] },
  { RTU: ["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. RTU Down Time", "Max. RTU Down Time", "Min. RTU Down Time", "Avg. RTU Alarms", "Max. RTU Alarms", "Min. RTU Alarms", "Avg. Test Alarms", "Max. Test Alarms", "Min. Test Alarms"] },
  { Link: ["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Link Down Time", "Max. Link Down Time", "Min. Link Down Time", "Avg. Link Alarms", "Max. Link Alarms", "Min. Link Alarms", "Avg. Link Tests", "Max. Link Tests", "Min. Link Tests", "Avg. Link Successful Tests", "Max. Link Successful Tests", "Min. Link Successful Tests", "Avg. Link Failed Tests", "Max. Link Failed Tests", "Min. Link Failed Tests"] },
  { OpticalRoute: ["Tests", "Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Optical Route Down Time", "Max. Optical Route Down Time", "Min. Optical Route Down Time", "Avg. Optical Route Tests", "Max. Optical Route Tests", "Min. Optical Route Tests", "Avg. Optical Route Successful Tests", "Max. Optical Route Successful Tests", "Min. Optical Route Successful Tests", "Avg. Optical Route Failed Tests", "Max. Optical Route Failed Tests", "Min. Optical Route Failed Tests"] },
  { Test: ["Alarms", "Avg. Alarm Acknowledge Time", "Max. Alarm Acknowledge Time", "Min. Alarm Acknowledge Time", "Avg. Alarm In Progress Time", "Max. Alarm In Progress Time", "Min. Alarm In Progress Time", "Avg. Alarm Resolve Time", "Max. Alarm Resolve Time", "Min. Alarm Resolve Time", "Avg. Test Length", "Max. Test Length", "Min. Test Length", "Avg. Test Wavelength", "Max. Test Wavelength", "Min. Test Wavelength", "Avg. Test Pulsewidth", "Max. Test Pulsewidth", "Min. Test Pulsewidth"] }
];


const Tabitem = ({selected, name,onclick}: itemprops) => {
  return (
    <button
    onClick={onclick}
      className={`h-[40px] w-full pl-[20px] text-left ${
        selected ? 'bg-[#C0E7F2]' : 'bg-white'
      }`}>
      {name}
    </button>
  );
};
const Tabitemorder = ({selected, name}: itemprops) => {
  return (
    <button
      className={`flex h-[40px] w-full flex-row items-center justify-between px-[20px] text-[18px] font-normal ${
        selected ? 'bg-[#C0E7F2]' : 'bg-white'
      }`}>
      <span>{name}</span>
      <FaArrowUp color={selected ? 'black' : '#006BBC'} />
    </button>
  );
};

function Reportsparameters() {
  const [selectedavailebel,setSelectedavalebel]=useState("")
  const [availebelcolumns,setAvailebelcolumns]=useState(list[0].Network)
  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-row justify-between">
        <div className="flex h-[667px] w-[28%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Available Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white px-[5px] py-[10px] overflow-auto">
        {list[0].Network?.map((data)=>
          <Tabitem onclick={()=>setSelectedavalebel(data)} name={data} selected={selectedavailebel == data} />
        )}
        
    
          </div>
        </div>

        <div className="mt-[44px] flex h-[540px] w-[7%] flex-col items-center  pt-[100px]">
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[5px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img src={GreaterThan} />
          </div>
          <div className="flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[180deg]" src={GreaterThan} />
          </div>
        </div>

        <div className="flex h-[667px] w-[28%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Selected Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white px-[5px] py-[10px]">
            <Tabitem onclick={()=>{}} name="Fault" selected={true} />
          </div>
        </div>

        <div className="mt-[44px] flex h-[540px] w-[7%] flex-col items-center  pt-[100px]">
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[5px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[90deg] " src={GreaterThan} />
            <img className="rotate-[90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[25px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[-90deg] " src={GreaterThan} />
            <img className="rotate-[-90deg] " src={GreaterThan} />
          </div>
          <div className="mb-[10px] flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img src={GreaterThan} />
          </div>
          <div className="flex h-[40px] w-[50px] flex-row items-center justify-center rounded-[10px] bg-[#BAC2ED]">
            <img className="rotate-[180deg]" src={GreaterThan} />
          </div>
        </div>

        <div className="flex h-[667px] w-[28%]  flex-col">
          <span className="mb-[20px] text-[20px] font-bold leading-[24.2px]">
            Order By Columns
          </span>
          <div className="h-[540px] w-full border-[1px] border-black bg-white">
            <Tabitemorder onclick={()=>{}} name="Fault" selected={false} />
          </div>
          <div className="mt-[10px] flex flex-row items-center justify-between">
            <SimpleBtn>Ascending</SimpleBtn>
            <SimpleBtn>Descending</SimpleBtn>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-end">
      <SimpleBtn>Open Report</SimpleBtn>
      <SimpleBtn className='mx-[9px]'>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
}

export default Reportsparameters;
