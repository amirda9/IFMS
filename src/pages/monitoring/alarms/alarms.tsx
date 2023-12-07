import React from 'react';
import {SimpleBtn, Table} from '~/components';
import {BiChevronRight, BiChevronsLeft, BiChevronsRight} from 'react-icons/bi';
import {BiChevronLeft} from 'react-icons/bi';
import {AiOutlinePlus} from 'react-icons/ai';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {Select} from '~/components';
import Rectangle from '~/assets/icons/Rectangle 112.png';
import Checkbox from '~/components/checkbox/checkbox';
import { Link } from 'react-router-dom';

const userList = [
  {
    id: 'mkjkj27',
    username: 'ahmad',
    name: 'ahmad',
    email: 'ahmad',
    role: 'ahmad',
    station: {
      name: 'ahmad',
    },
    region: {
      name: 'ahmad',
    },
  },
  {
    id: 'mkjkjuu27',
    username: 'hasan',
    name: 'hasan',
    email: 'hasan',
    role: 'hasan',
    station: {
      name: 'hasan',
    },
    region: {
      name: 'hasan',
    },
  },
];

const usertabelcolumn = {
  user: {label: 'User', size: 'w-[60%]'},
  status: {label: 'Status', size: 'w-[40%]', sort: true},
};
const usertabelitems = [
  {
    user: (
      <Select
        className="w-[242px] bg-[#636363]"
        value={''}
        onChange={event => {
          console.log('hghjg');
        }}>
        <option value="" className="hidden" />
        <option value={undefined} className="hidden" />
        {userList.map(user => (
          <option value={user.id} key={user.id}>
            {user.username}
          </option>
        ))}
      </Select>
    ),
    status: 'RTU230P10',
  },
];

const bottomcolumns = {
  secondarysource: {label: 'Secondary Source', size: 'w-[22.5%]'},
  alarmsime: {label: 'Alarm Time', size: 'w-[22.5%]'},
  linksource: {label: 'Link Source', size: 'w-[22.5%]'},
  linksestination: {label: 'Link Destination', size: 'w-[22.5%]'},
  cablesuct: {label: 'Cable / Duct', size: 'w-[10%]'},
};

const topcolumns = {
  primarysource: {label: 'Primary Source', size: 'w-[16%]'},
  alarmtype: {label: 'Alarm Type', size: 'w-[16%]'},
  alarmtime: {label: 'Alarm Time', size: 'w-[16%]'},
  Severity: {label: 'Severity', size: 'w-[5%]'},
  State: {label: 'State', size: 'w-[10%]'},
  lastmodified: {label: 'Last Modified', size: 'w-[16%]'},
  actinguser: {label: 'Acting User', size: 'w-[16%]'},
  'chekbox': {label: '', size: 'w-[5%]'},
};
const topitems = [
  {
    tabbodybg: [{name: 'Severity', bg: '#FF0000'}],
    tabrowbg: '#C0E7F2',
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    tabbodybg: [
      {name: 'Severity', bg: '#FF0000'},
      {name: 'State', bg: '#18C047'},
    ],
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': (
      <Checkbox
        checkstatus={true}
        onclick={e => {}}
        iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
        classname={
          'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
        }
      />
    ),
  },
  {
    tabbodybg: [
      {name: 'Severity', bg: '#FF0000'},
      {name: 'State', bg: '#18C047'},
    ],
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': (
      <Checkbox
        checkstatus={true}
        onclick={e => {}}
        iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
        classname={
          'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
        }
      />
    ),
  },
  {
    tabbodybg: [
      {name: 'Severity', bg: '#FF0000'},
      {name: 'State', bg: '#18C047'},
    ],
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': 'lkjk',
  },
  {
    primarysource: 'RTU230P10',
    alarmtype: 'Fiber Fault',
    alarmtime: '2023-05-10 19:41:36',
    Severity: 'Medium',
    State: 'Acknowledged',
    lastmodified: '2023-05-10 23:41:36',
    actinguser: 'Ahmad Kazemi',
    '': (
      <Checkbox
        checkstatus={true}
        onclick={e => {}}
        iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
        classname={
          'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
        }
      />
    ),
  },
];
const bottomItems = [
  {
    secondarysource: 'Connector Reflection',
    alarmsime: '2023-05-10 19:41:36',
    linksource: 'Station 1',
    linksestination: 'Station 2',
    cablesuct: '1',
  },
  {
    secondarysource: 'Connector Reflection',
    alarmsime: '2023-05-10 19:41:36',
    linksource: 'Station 1',
    linksestination: 'Station 2',
    cablesuct: '1',
  },
];

function Alarms() {
  return (
    <div className="flex w-full flex-col p-[10px]">
      <div className="flex w-full flex-row justify-between border-b-[1px] border-[#D9D9D9]">
        {/* ***************** top ********************* top *****************************top *************** */}
        <div className="w-[calc(100%-400px)]  pr-[10px] pt-[7px]">
          <div className="flex w-full flex-row items-center">
            <span className="text-[18px] font-normal leading-6">
              Total Alarm(s)
            </span>
            <input
              type="number"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            <SimpleBtn className="ml-2 py-[6px]" type="button">
             New/Updated Alarm(s)
            </SimpleBtn>
            <input
              type="number"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />

            <SimpleBtn className="ml-4 px-[2px] py-[5px]" type="button">
              <BiChevronsLeft size={20} />
            </SimpleBtn>
            <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
              <BiChevronLeft size={20} />
            </SimpleBtn>
            <span className="ml-[2px] text-18px] font-normal leading-6">
              page
            </span>
            <input
              type="number"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
            <span className="ml-2">/5</span>
            <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
              <BiChevronRight size={20} />
            </SimpleBtn>
            <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
              <BiChevronsRight size={20} />
            </SimpleBtn>

            <span className="ml-[2px] text-[18px] font-normal leading-6">
            Rows Per Page
            </span>
            <input
              type="number"
              className="ml-2 h-[40px] w-[54px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
            />
          </div>
          {/* ***************** top tabel ********************* top tabel *****************************top tabel *************** */}
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
            thclassname="pl-[4px]"
            tdclassname='pl-[4px] text-left'
            containerClassName="w-full min-h-[72px] text-left ml-[5px]  overflow-y-auto mt-[20px]"
            dynamicColumns={['chekbox']}
            renderDynamicColumn={({key, value}) => {
              if (key === 'chekbox'){
                return (
              
                  <IoTrashOutline
                  onClick={() => {}}
                  className="mx-auto text-red-500 cursor-pointer"
                  size={22}
                />
           
               );
              }
                
         
              else return <></>;
            }}
            // dynamicColumns={'index'}
            // renderDynamicColumn={renderDynamicColumn('right')}
          />
        </div>
        {/* ***************** right ********************* right *****************************right *************** */}
        <div className="box-border flex h-[765px] w-[400px] flex-col border-l-[1px] border-[#D9D9D9] pb-[10px] pl-[20px]">
          <div className="flex flex-row pt-[13px]">
            <AiOutlinePlus color="#18C047" size={25} />
            <IoTrashOutline size={24} className={'ml-2 text-red-500'} />
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
            cols={usertabelcolumn}
            tabicon={'Name'}
            items={usertabelitems}
            thclassname="pl-2"
            containerClassName="w-full min-h-[72px] text-left ml-[5px]  overflow-y-auto mt-[30px]"
            // dynamicColumns={['index']}
            // renderDynamicColumn={renderDynamicColumn('right')}
          />
          <div className="mt-[20px] flex flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-6">User</span>

            <Select
              // disabled={
              //   userrole == 'superuser' ||
              //   networkDetail?.data?.access?.role == 'superuser'
              //     ? false
              //     : true
              // }
              className="w-[242px] bg-[#636363]"
              value={''}
              onChange={event => {
                console.log('hghjg');

                // setUserAdmin(event.target.value);
              }}>
              <option value="" className="hidden" />
              <option value={undefined} className="hidden" />
              {userList.map(user => (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-6">State</span>

            <Select
              // disabled={
              //   userrole == 'superuser' ||
              //   networkDetail?.data?.access?.role == 'superuser'
              //     ? false
              //     : true
              // }
              className="w-[242px]"
              value={''}
              onChange={event => {
                console.log('hghjg');

                // setUserAdmin(event.target.value);
              }}>
              <option value="" className="hidden" />
              <option value={undefined} className="hidden" />
              {userList.map(user => (
                <option value={user.id} key={user.id}>
                  {user.username}
                </option>
              ))}
            </Select>
          </div>

          <span className="mt-[15px] text-[20px] font-normal leading-6">
            Assignment Time
          </span>
          <span className="mt-[15px] text-[20px] font-normal leading-6">
            Assigned By
          </span>
          <span className="mt-[15px] text-[20px] font-normal leading-6">
            Last Modified
          </span>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="mt-[0px] text-[20px] font-normal leading-6">
                Escalate after
              </span>
              <span className="mt-[5px] text-[20px] font-normal leading-6">
                (Day:Hr:Min)
              </span>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
            </div>
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <span className="mt-[0px] text-[20px] font-normal leading-6">
                Timeout after
              </span>
              <span className="mt-[5px] text-[20px] font-normal leading-6">
                (Day:Hr:Min)
              </span>
            </div>
            <div className="flex flex-row items-center">
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
              <input
                type="number"
                className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
              />
            </div>
          </div>

          <span className="mt-[20px] text-[20px] font-normal leading-6">
            Description
          </span>
          <textarea className="mt-[3px] h-[76px] w-full rounded-[10px] bg-white" />

          <div className="mt-[10px] flex flex-row">
            <img src={Rectangle} className="mt-[0px] h-[25px] w-[25px]" />
            <img
              src={Rectangle}
              className="ml-[10px] mt-[0px] h-[25px] w-[25px]"
            />
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <button className="w-[180px] rounded-md  bg-[#636363] py-[6px] text-sm">
              Acknowledge
            </button>

            <button className="w-[180px] rounded-md  bg-[#636363] py-[6px] text-sm">
              ignore
            </button>
          </div>

          <div className="mt-[20px] flex flex-row items-center justify-between">
            <button className="w-[180px] rounded-md  bg-[#BAC2EDB0] py-[6px] text-sm">
              Select All
            </button>

            <button className="w-[180px] rounded-md  bg-[#BAC2EDB0] py-[6px] text-sm">
              Delete Selected
            </button>
          </div>
        </div>
      </div>
      {/* *********** bottom tabel   ********** bottom tabel ************* bottom tabel *********************** */}

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
        cols={bottomcolumns}
        tabicon={'Name'}
        items={bottomItems}
        thclassname="pl-2"
        containerClassName="w-[calc(100%-500px)] min-h-[72px] text-left ml-[5px]  overflow-y-auto mt-[20px]"
        // dynamicColumns={'index'}
        // renderDynamicColumn={renderDynamicColumn('right')}
      />
    </div>
  );
}

export default Alarms;
