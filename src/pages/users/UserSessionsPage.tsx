import {FC} from 'react';
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
    terminate: <p>hi</p>,
  },
  {
    index: 2,
    ipAddress: '192.168.1.1',
    startDate: '2022-02-02 20:30:30',
    lastAccess: '2022-02-02 20:30:30',
    state: 'Offline',
    terminate: <p>hi</p>,
  },
];

const UserSessionsPage: FC = () => {
  return (
    <div>
      <Table width="w-full" cols={columns} items={items} />
    </div>
  );
};

export default UserSessionsPage;
