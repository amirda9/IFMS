import React, {useRef, useState} from 'react';
import {SidebarItem, SimpleBtn, Table} from '~/components';
import dateicon from '~/assets/images/dateicon.png';
import Checkbox from '~/components/checkbox/checkbox';
import { IoOpenOutline, IoTrashOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
function Testondemand() {
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);
  const [selectedtest,setSelectedtest]=useState("")
  const topcolumns = {
   index: {label: 'Index', size: 'w-[2%]'},
   date: {label: 'Date', size: 'w-[17%]'},
   opticalroute: {label: 'Optical Route', size: 'w-[28%]'},
   testsetup: {label: 'Test Setup', size: 'w-[17%]'},
   user: {label: 'User', size: 'w-[18%]'},
   status: {label: 'Status', size: 'w-[6%]'},
   detail: {label: 'Detail', size: 'w-[2%]'},
   delete: {label: 'Delete', size: 'w-[2%]'},
 };

 const topitems = [
  {
    index: 0,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 1,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 2,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 3,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 4,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 5,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    tabbodybg: [{name: 'status', bg: '#FFE600'}],
    index: 6,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 7,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 3,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
  {
    index: 7,
    date: "2022-10-29 22:59:59",
    opticalroute:"Optical Route 1",
    testsetup:"Test Setup 1",
    user:"Station1",
    status:"Pending",
    detail: "",
    delete:"",
  },
];
  return (
    <div className="flex w-full flex-col p-[20px]">
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-[calc(50%-100px)] flex-col">
          <span className="mb-[10px] text-[20px] font-normal leading-[24.2px]">
            Optical Route
          </span>
          <div className="h-[400px] w-full bg-white"></div>
          <div className="mt-4 flex w-full flex-row items-center">
            <span className="text-[20px] font-normal leading-6">From</span>
            <input
              ref={firstdateref}
              onChange={e => {}}
              value={''}
              type="date"
              className="ml-4 h-8 w-[150px] rounded-md border border-black px-2"
            />
            <img
              src={dateicon}
              onClick={() => firstdateref.current.showPicker()}
              className="ml-[5px] h-[35px] w-[35px]"
            />

            <span className="ml-10 text-[20px] font-normal leading-6">to</span>
            <input
              ref={secenddateref}
              onChange={e => {}}
              value={''}
              type="date"
              className="ml-4 h-8 w-[150px] rounded-md border border-black px-2"
            />
            <img
              src={dateicon}
              onClick={() => secenddateref.current.showPicker()}
              className="ml-[5px] h-[35px] w-[35px]"
            />
          </div>
        </div>

        <div className="flex w-[calc(50%-100px)] flex-col">
          <span className="mb-[10px] text-[20px] font-normal leading-[24.2px]">
            Optical Route
          </span>
          <div className="h-[400px] w-full bg-white p-2">
           <button onClick={()=>setSelectedtest("Test Setup 1")} className={`w-full ${selectedtest == "Test Setup 1"?"bg-[#C0E7F2] font-bold":"bg-white font-normal"} h-[40px] text-left`}>
           Test Setup 1
           </button>
           <button onClick={()=>setSelectedtest("Test Setup 2")} className={`w-full ${selectedtest == "Test Setup 2"?"bg-[#C0E7F2] font-bold":"bg-white font-normal"} h-[40px] text-left`}>
           Test Setup 2
           </button>
          </div>
          <div className="mt-4 flex w-full flex-row items-center">
            <Checkbox
              checkstatus={true}
              onclick={e => {}}
              iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
              classname={
                'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
              }
            />
            <span className="text-[20px] font-normal leading-6">
              Show Completed Tests From
            </span>
            <input
              ref={secenddateref}
              onChange={e => {}}
              value={''}
              type="date"
              className="ml-6 h-8 w-48 rounded-md border border-black px-2"
            />
            <img
              src={dateicon}
              onClick={() => secenddateref.current.showPicker()}
              className="ml-[5px] h-[35px] w-[35px]"
            />
          </div>
        </div>

        <div className="flex  w-[134px] flex-col justify-between pt-[34px]">
          <div className="flex flex-col ">
            <SimpleBtn className="mb-[30px]">Parameters</SimpleBtn>
            <SimpleBtn className="px-[34px]">Start Test</SimpleBtn>
          </div>

          <SimpleBtn className="px-[47px] mb-1">
          Apply
          </SimpleBtn>
        </div>
      </div>
      <Table
            // loading={state.regionstationlist?.httpRequestStatus !== 'success'}
            // onclicktitle={(tabname: string, sortalfabet: boolean) => {
            //   const dataa = [...reightstationsorted];
            //   if (sortalfabet) {
            //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
            //   } else {
            //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
            //   }
            //   setReightstationssorted(dataa);
            // }}
            bordered={true}
            cols={topcolumns}
            tabicon={'Name'}
            items={topitems}
            thclassname="pl-2 text-left"
            tdclassname="pl-2 text-left"
            containerClassName="w-full text-left min-h-[72px]  ml-[5px] pb-0 overflow-y-auto mt-[20px]"
            dynamicColumns={['detail', 'delete']}
            renderDynamicColumn={({key, value}) => {
              if (key === 'detail')
                return (
                   <Link to={value.detail}>
                    <IoOpenOutline  size={22} className="mx-auto" />
              </Link>
                );
              else if (key === 'delete')
                return (
                  <IoTrashOutline
                    onClick={() => {}}
                    className="mx-auto text-red-500 cursor-pointer"
                    size={22}
                  />
                );
              else return <></>;
            }}
          />
    </div>
  );
}

export default Testondemand;
