import React, {useRef} from 'react';
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from 'react-icons/bi';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {Link} from 'react-router-dom';
import dateicon from '~/assets/images/dateicon.png';
import {SimpleBtn, Table} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
const topcolumns = {
  index: {label: 'Index', size: 'w-[2%]'},
  date: {label: 'Date', size: 'w-[17%]'},
  testtype: {label: 'Test Type', size: 'w-[18%]'},
  opticalroute: {label: 'Optical Route', size: 'w-[18%]'},
  testsetup: {label: 'Test Setup', size: 'w-[17%]'},
  user: {label: 'User', size: 'w-[18%]'},
  status: {label: 'Status', size: 'w-[6%]'},
  detail: {label: 'Detail', size: 'w-[2%]'},
  delete: {label: 'Delete', size: 'w-[2%]'},
};

const topitems = [
  {
    index: 0,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 1,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 2,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 3,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 4,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 5,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    tabbodybg: [{name: 'status', bg: '#FFE600'}],
    index: 6,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 7,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 3,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
  {
    index: 7,
    date: '2022-10-29 22:59:59',
    testtype: 'Scheduled - Monitoring',
    opticalroute: 'Optical Route 1',
    testsetup: 'Test Setup 1',
    user: 'Station1',
    status: 'Pending',
    detail: '',
    delete: '',
  },
];

function Status() {
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);

  return (
    <div className="flex w-full flex-col p-[20px]">
      <h1 className="my-6 mt-14 font-bold text-[red] text-[20px]">
        This page requires a Full-Access license to view the content
      </h1>

      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-row items-center">
          <span className="text-[20px] font-normal leading-6">
            Show Scheduled Tests Till
          </span>
          <input
            ref={firstdateref}
            onChange={e => {}}
            value={''}
            type="date"
            className="ml-6 h-8 w-48 rounded-md border border-black px-2"
          />
          <img
            src={dateicon}
            onClick={() => firstdateref.current.showPicker()}
            className="ml-[5px] h-[35px] w-[35px]"
          />
        </div>
        <div className="flex flex-row items-center">
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

        <SimpleBtn>Apply</SimpleBtn>
      </div>
      {/* ***************tabel ****************** tabel ************ tabel ********* tabel ***************************** */}
      <div className="min-h-[calc(100%-90px)] w-full">
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
                  <IoOpenOutline size={22} className="mx-auto" />
                </Link>
              );
            else if (key === 'delete')
              return (
                <IoTrashOutline
                  onClick={() => {}}
                  className="mx-auto cursor-pointer text-red-500"
                  size={22}
                />
              );
            else return <></>;
          }}
        />
      </div>
      <div className="relative flex h-[40px] w-full flex-row justify-center">
        <div className="mt-[20px] flex flex-row  items-center">
          <SimpleBtn className="px-[2px] py-[5px]" type="button">
            <BiChevronsLeft size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronLeft size={20} />
          </SimpleBtn>
          <span className="ml-[20px] text-[20px] font-normal leading-6">
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
        <div className="absolute right-0 top-[12px] flex flex-row items-center">
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

export default Status;
