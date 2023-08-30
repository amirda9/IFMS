import {FC} from 'react';
import { IoTrashBinOutline, IoTrashOutline } from 'react-icons/io5';
import {Table} from '~/components';

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
    terminate: <IoTrashOutline className='text-red-500 active:text-red-300 mx-auto' size={25} />,
  },
  {
    index: 2,
    ipAddress: '192.168.1.1',
    startDate: '2022-02-02 20:30:30',
    lastAccess: '2022-02-02 20:30:30',
    state: 'Offline',
    terminate: <IoTrashOutline className='text-red-500 active:text-red-300 mx-auto' size={25} />,
  },
];

const UserSessionsPage: FC = () => {
  return (
    <div>
      <Table width="w-full" cols={columns} items={items} bordered />
    </div>
  );
};

export default UserSessionsPage;
