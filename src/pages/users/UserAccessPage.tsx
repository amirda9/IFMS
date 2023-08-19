import {FC} from 'react';
import {Description, Select, Table} from '~/components';
import {Role} from '~/constant/users';

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
        <Select className="w-80">
          {Object.keys(Role).map(roleKey => (
            <option selected value={roleKey}>
              {Role[roleKey as keyof typeof Role]}
            </option>
          ))}
        </Select>
      </Description>
      <Description label="" items="start" className="h-full">
        <Table cols={columns} items={items} width="w-3/5" />
      </Description>
    </>
  );
};

export default UserAccessPage;
