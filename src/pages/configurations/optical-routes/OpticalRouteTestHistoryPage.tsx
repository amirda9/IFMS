import dayjs from 'dayjs';
import {FC, useState} from 'react';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[7%]'},
  date: {label: 'Date', size: 'w-[18%]', sort: true},
  type: {label: 'Type', size: 'w-[18%]'},
  alarms: {label: 'Alarms', size: 'w-[9%]'},
  rtu: {label: 'RTU', size: 'w-[24%]'},
  station: {label: 'Station', size: 'w-[10%]'},
  details: {label: 'Details', size: 'w-[7%]'},
  delete: {label: 'Delete', size: 'w-[7%]'},
};

const items = [
  {
    index: 1,
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: 'Proactive-On Demand',
    alarms: 0,
    rtu: 'ARIO4P1625',
    station: 'Station1',
    details: '',
    delete: '',
  },
  {
    index: 2,
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: 'Maintenance-Automatic',
    alarms: 2,
    rtu: 'ARIO4P1625',
    station: 'Station1',
    details: '',
    delete: '',
  },
  {
    index: 3,
    date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    type: 'Maintenance-On Demand',
    alarms: 4,
    rtu: 'ARIO4P1625',
    station: 'Station1',
    details: '',
    delete: '',
  },
];

const OpticalRouteTestHistoryPage: FC = () => {
  const [selectedtab,setSelectedtab]=useState("Date")
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-grow flex-col gap-y-4 pr-16">
        <Table
        tdclassname='text-left pl-[6px]'
        onclicktitle={(e:string)=>setSelectedtab(e)}
        tabicon={selectedtab}
          cols={columns}
          items={items}
          dynamicColumns={['details', 'delete']}
          renderDynamicColumn={({key}) => {
            if (key === 'details')
              return <IoOpenOutline size={22} className="mx-auto" />;
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
    </div>
  );
};

export default OpticalRouteTestHistoryPage;
