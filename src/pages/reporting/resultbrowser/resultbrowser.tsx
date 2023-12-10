import React, {useRef, useState} from 'react';
import {Select, SimpleBtn, Table} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import dateicon from '~/assets/images/dateicon.png';
import './index.css';
import { Link } from 'react-router-dom';
import { IoOpenOutline, IoTrashOutline } from 'react-icons/io5';
import { BiChevronLeft, BiChevronRight, BiChevronsLeft, BiChevronsRight } from 'react-icons/bi';
type Radiotype = {
  check: boolean;
  onclick: () => void;
};

const topcolumns = {
  index: {label: 'Index', size: 'w-[2%]'},
  date: {label: 'Test Date', size: 'w-[16%]'},
  rtu: {label: 'RTU', size: 'w-[10%]'},
  opticalRoute: {label: 'Optical Route', size: 'w-[16%]'},
  testSetup: {label: 'Test Setup', size: 'w-[16%]'},
  faultStatus: {label: 'Fault Status', size: 'w-[9%]'},
  faultType: {label: 'Fault Type', size: 'w-[11%]'},
  distance: {label: 'Distance (km)', size: 'w-[11%]'},
  Loss: {label: 'Loss (dB)', size: 'w-[6%]'},
  detail: {label: 'Detail', size: 'w-[2%]'},
  delete: {label: 'Delete', size: 'w-[2%]'},
};

const topitems = [
  {
    index:0,
    date: "2022-10-29 22:59:59",
    rtu:"RTU 1",
    opticalRoute:"Optical Route 1",
    testSetup:"Test Setup 1",
    faultType:"Break",
    faultStatus:"Still There",
    distance:"200",
    Loss:"4",
    detail:"",
    delete:"",
  },
  {
    index:1,
    date: "2022-10-29 22:59:59",
    rtu:"RTU 1",
    opticalRoute:"Optical Route 1",
    testSetup:"Test Setup 1",
    faultType:"Break",
    faultStatus:"Still There",
    distance:"200",
    Loss:"4",
    detail:"",
    delete:"",
  },
  {
    index:1,
    date: "2022-10-29 22:59:59",
    rtu:"RTU 1",
    opticalRoute:"Optical Route 1",
    testSetup:"Test Setup 1",
    faultType:"Break",
    faultStatus:"Still There",
    distance:"200",
    Loss:"4",
    detail:"",
    delete:"",
  },
];

function Resultbrowser() {
  const fromdateref: any = useRef(null);
  const lastdateref: any = useRef(null);
  const [fromdate, setFromdate] = useState('');
  const [lastdate, setLastdate] = useState('');
  const [filterByTime,setFilterByTime]=useState(false)
  const [selectedradio, setSelectedradio] = useState('Filter By Optical Route');
  const [selectedradiotime, setSelectedradiotime] = useState('Last');
  const [last,setLast]=useState(0)
  function RadioButton({check, onclick}: Radiotype) {
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => onclick()}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              check ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
      </div>
    );
  }
  return (
    <div className="border-box flex w-full flex-col p-[20px]">
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-[calc(50%-190px)] flex-col">
          <div className="mb-[20px] flex flex-row">
            <RadioButton
              check={selectedradio == 'Filter By RTU' ? true : false}
              onclick={() => setSelectedradio('Filter By RTU')}
            />
            <span className="ml-[15px] text-[20px] font-bold leading-[24.2px] text-[#000000]">
              Filter By RTU
            </span>
          </div>

          <div className="flex h-[350px] w-full flex-col overflow-y-auto bg-white"></div>
        </div>

        <div className="flex w-[calc(50%-190px)] flex-col">
          <div className="mb-[20px] flex flex-row">
            <RadioButton
              check={selectedradio == 'Filter By Optical Route' ? true : false}
              onclick={() => setSelectedradio('Filter By Optical Route')}
            />
            <span className="ml-[15px] text-[20px] font-bold leading-[24.2px] text-[#000000]">
              Filter By Optical Route
            </span>
          </div>
          <div className="flex h-[350px] w-full flex-col overflow-y-auto bg-white"></div>
        </div>

        <div className="flex h-[350px] w-[350px] flex-col ">
          <div className="flex w-full flex-row items-center">
            <Checkbox
              checkstatus={filterByTime}
              onclick={e => setFilterByTime(e)}
              iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px] text-[#18C047]"
              classname={
                'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] text-[#18C047] border-[#000000]'
              }
            />

            <span className="ml-[15px] text-[20px] font-bold leading-[24.2px] text-[#000000]">
              Filter By Time
            </span>
          </div>

          <div className="mt-[20px] flex w-full flex-row items-center justify-between">
            <RadioButton
              check={selectedradiotime == 'Last' ? true : false}
              onclick={() => setSelectedradiotime('Last')}
            />
            <div className="flex w-[calc(100%-20px)] flex-row items-center">
              <span className="w-[30px] ml-[15px] text-[20px] font-normal leading-[24.2px] text-[#000000]">
                Last
              </span>
              <div className="flex w-[calc(100%-60px)] flex-row justify-between">
                <input type='number' onChange={(e)=>setLast(Number(e.target.value))} className="h-[40px] w-[74px] ml-6 rounded-[10px] border-[1px] border-[#000000] bg-white" />

                <Select onChange={e => {}} className="mr-[40px] w-[120px] h-[40px]">
                  <option value="" className="hidden">
                    light
                  </option>
                  <option value={undefined} className="hidden">
                    light
                  </option>

                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    dark
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    light
                  </option>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-[40px] mb-[140px] flex w-full flex-row items-center justify-between">
            <RadioButton
              check={selectedradiotime == 'From' ? true : false}
              onclick={() => setSelectedradiotime('From')}
            />
            <div className="flex w-[calc(100%-20px)]   flex-col items-center">
              <div className="flex w-full mb-[20px] flex-row justify-between items-center">
                <span className="ml-[15px] w-[30px] text-[20px] font-normal leading-[24.2px] text-[#000000]">
                  From
                </span>

                <input
                  onChange={e => {
                    setFromdate(e.target.value);
                  }}
                  value={fromdate}
                  ref={fromdateref}
                  type="datetime-local"
                  className="appearance:none ml-6 h-[40px] w-[calc(100%-90px)] rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => fromdateref.current.showPicker()}
                  className="ml-[5px] mr-[15px] h-[35px] w-[35px]"
                />
              </div>
              <div className="flex w-full flex-row justify-between items-center">
                <span className="ml-[15px] w-[30px] text-[20px] font-normal leading-[24.2px] text-[#000000]">
                  Last
                </span>

                <input
                  onChange={e => {
                    setLastdate(e.target.value);
                  }}
                  value={lastdate}
                  ref={lastdateref}
                  type="datetime-local"
                  className="appearance:none ml-6 h-[40px] w-[calc(100%-90px)] rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => lastdateref.current.showPicker()}
                  className="ml-[5px] mr-[15px] h-[35px] w-[35px]"
                />
              </div>
            </div>
          </div>
          <SimpleBtn className='ml-[calc(100%-100px)]'>
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
            <div className='w-full flex flex-row justify-center h-[40px] relative'>
            <div className='flex flex-row items-center  mt-[20px]'>
            <SimpleBtn className="px-[2px] py-[5px]" type="button">
              <BiChevronsLeft size={20} />
            </SimpleBtn>
            <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
              <BiChevronLeft size={20} />
            </SimpleBtn>
            <span className="text-[20px] font-normal leading-6 ml-[20px]">
              page
            </span>
            <input
              type="number"
              className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            <span className="ml-2">/5</span>
            <SimpleBtn className="ml-[20px] px-[2px] py-[5px]" type="button">
              <BiChevronRight size={20} />
            </SimpleBtn>
            <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
              <BiChevronsRight size={20} />
            </SimpleBtn>
            </div>
            <div className='flex flex-row items-center absolute top-[12px] right-0'>
            <span className="text-[20px] font-normal leading-6">
            Rows Per Page
        </span>
        <input
              type="number"
              className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            </div>
          </div>
    </div>
  );
}

export default Resultbrowser;
