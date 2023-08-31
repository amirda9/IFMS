import {FC} from 'react';
import {IoTrashBinOutline, IoTrashOutline} from 'react-icons/io5';
import {SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  ipAddress: {label: 'IP Address', size: 'w-[20%]'},
  startDate: {label: 'Start Date', size: 'w-[20%]'},
  lastAccess: {label: 'Last Access', size: 'w-[20%]'},
  state: {label: 'State', size: 'w-[20%]'},
  terminate: {label: 'Terminate', size: 'w-[10%]'},
};

const items = [
  {
    index: 1,
    ipAddress: '192.168.1.1',
    startDate: '2022-02-02 20:30:30',
    lastAccess: '2022-02-02 20:30:30',
    state: 'Offline',
    terminate: (
      <IoTrashOutline
        className="mx-auto text-red-500 active:text-red-300"
        size={25}
      />
    ),
  },
  {
    index: 2,
    ipAddress: '192.168.1.1',
    startDate: '2022-02-02 20:30:30',
    lastAccess: '2022-02-02 20:30:30',
    state: 'Offline',
    terminate: (
      <IoTrashOutline
        className="mx-auto text-red-500 active:text-red-300"
        size={25}
      />
    ),
  },
];

const UserSessionsPage: FC = () => {
  return (
    <>
      <div className='flex-grow'>
        <Table cols={columns} items={items} bordered />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="../../">
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default UserSessionsPage;
