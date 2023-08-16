import {FC} from 'react';
import {Description, Select, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  network: {label: 'Network', size: 'w-[90%]', sort: true},
};

const items = [...new Array(4)].map((_, index) => ({
  index: index + 1,
  network: 'Network ' + (index + 1),
}));

const UserAccessPage: FC = () => {
  return (
    <>
      <Description label="Role" items="start" className="mb-4">
        <Select className="w-80" value={'me'}>
          <option selected value="User 1">
            User 1
          </option>
          <option value="User 2">User 2</option>
          <option value="User 3">User 3</option>
          <option value="User 4">User 4</option>
        </Select>
      </Description>
      <Description label="Network Viewers(s)" items="start" className="h-full">
        <Table
          // loading={viewers?.httpRequestStatus === 'loading'}
          cols={columns}
          items={items}
          width="w-3/5"
        />
      </Description>
    </>
  );
};

export default UserAccessPage;
