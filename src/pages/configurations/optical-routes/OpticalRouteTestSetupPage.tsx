import {FC, useState} from 'react';
import { BsPlusLg } from 'react-icons/bs';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {Link, Outlet} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';

const columns = {
  name: {label: 'Name', size: 'w-[20%]', sort: true},
  type: {label: 'Type', size: 'w-[15%]'},
  wavelength: {label: 'Wavelength', size: 'w-[15%]'},
  rtu: {label: 'RTU', size: 'w-[20%]'},
  station: {label: 'Station', size: 'w-[20%]'},
  details: {label: 'Details', size: 'w-[5%]'},
  delete: {label: 'Delete', size: 'w-[5%]'},
};

const items = [
  {
    name: 'Test Setup 1',
    type: 'Monitoring',
    wavelength: 1625,
    rtu: 'ARIO4P1625',
    station: 'Station 1',
    detail: '',
    delete: '',
  },
  {
    name: 'Test Setup 2',
    type: 'Monitoring',
    wavelength: 1625,
    rtu: 'ARIO4P1625',
    station: 'Station 1',
    detail: '',
    delete: '',
  },
  {
    name: 'Test Setup 1',
    type: 'Proactive',
    wavelength: 1625,
    rtu: 'ARIO4P1625',
    station: 'Station 1',
    detail: '',
    delete: '',
  },
];

const OpticalRouteTestSetupPage: FC = () => {
  const [selectedTab,setSelectedtab]=useState("Name")
  return (
    <div className="flex flex-grow flex-col">
      
      <div className="relative flex  flex-grow flex-col gap-y-4 pr-16">
      <BsPlusLg size={25} color="#18C047" className=' absolute right-[30px]' />
        <Table
          cols={columns}
          items={items}
          tdclassname="text-left pl-[6px]"
          tabicon={selectedTab}
          onclicktitle={(e:string)=> setSelectedtab(e)}
          dynamicColumns={['details', 'delete']}
          renderDynamicColumn={({key}) => {
            if (key === 'details')
              return (
                <Link to="test-id-goes-here">
                  <IoOpenOutline size={22} className="mx-auto" />
                </Link>
              );
            else if (key === 'delete')
              return (
                <IoTrashOutline className="mx-auto text-red-500" size={22} />
              );
            else return <></>;
          }}
          bordered
        />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>

      {/* Details Modal */}
      <Outlet />
    </div>
  );
};

export default OpticalRouteTestSetupPage;
