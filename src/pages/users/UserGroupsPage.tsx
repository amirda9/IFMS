import {FC} from 'react';
import {Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  groupName: {label: 'Group Name', size: 'w-[90%]', sort: true},
};

const items = [...new Array(4)].map((_, index) => ({
  index: index + 1,
  groupName: 'Group' + (index + 1),
}));

const UserGroupsPage: FC = () => {
  return (
    <div>
      <Table width="w-3/4" cols={columns} items={items} />
    </div>
  );
};

export default UserGroupsPage;
