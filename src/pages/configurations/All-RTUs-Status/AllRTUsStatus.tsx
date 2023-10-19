import React from 'react';
import {Table} from '~/components';
const columns = {
  //  index: {label: 'Index', size: 'w-[9%]'},
  name: {label: 'Name', size: 'w-[9%]', sort: true},
  Network: {label: 'Network', size: 'w-[9%]'},
  Station: {label: 'Station', size: 'w-[9%]'},
  ConnStatus: {label: 'Conn. Status', size: 'w-[15%]'},
  LastConnAttempt: {label: 'Last Conn. Attempt', size: 'w-[13%]'},
  CumulLastSuccessfulConnAttemptative: {
    label: 'Last Successful Conn. Attempt',
    size: 'w-[18%]',
  },
};
const dataa = [
  {
    tabbodybg: [{name: 'ConnStatus', bg: '#0040ff'}],
    name: 'RTU4P1310',
    Network: 'Network 1',
    Station: 'Station 1',
    ConnStatus: 'Connected',
    LastConnAttempt: '2023-05-10 23:41:36',
    CumulLastSuccessfulConnAttemptative: '2023-05-10 23:41:36',
  },
  {
    tabbodybg: [{name: 'ConnStatus', bg: '#99ff00'}],
    name: 'RTU4P1310',
    Network: 'Network 1',
    Station: 'Station 1',
    ConnStatus: 'Not Connected',
    LastConnAttempt: '2023-05-10 23:41:36',
    CumulLastSuccessfulConnAttemptative: '2023-05-10 23:41:36',
  },
];
function AllRTUsStatus() {
  return (
    <div className="w-full p-[20px]">
      <Table
        onclicktitle={(tabname: string, sortalfabet: boolean) => () => {}}
        tabicon={'Name'}
        cols={columns}
        items={dataa}
        bordered={true}
        // dynamicColumns={['index']}
        // renderDynamicColumn={data => data.index+1}
        containerClassName="w-full"
      />
    </div>
  );
}

export default AllRTUsStatus;