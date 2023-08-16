import {FC} from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';

const UsersPage: FC = () => {
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Users">
      {[...new Array(4)].map((_, value) => (
        <SidebarItem
          name={`User ${value + 1}`}
          to={value.toString()}
          key={value}
        />
      ))}
    </SidebarLayout>
  );
};

export default UsersPage;
