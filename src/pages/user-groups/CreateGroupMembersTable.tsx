import {Dispatch, FC, SetStateAction, useState} from 'react';
import {toast} from 'react-toastify';
import {Table} from '~/components';
import {useHttpRequest} from '~/hooks';

const columns = {
  select: {label: '', size: 'w-[10%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[80%]'},
};

type UserTableItem = {
  select: boolean;
  index: number;
  user: string;
  userId: string;
};

type Props = {
  selectedUsers: string[];
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
};

const CreateGroupMembersTable: FC<Props> = ({
  selectedUsers,
  setSelectedUsers,
}) => {
  const [usersTableItems, setUsersTableItems] = useState<UserTableItem[]>([]);

  useHttpRequest({
    selector: state => state.http.userList,
    initialRequests: request => {
      request('userList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (lastState?.httpRequestStatus === 'loading') {
        if (state?.httpRequestStatus === 'success') {
          const users = state.data || [];
          setUsersTableItems(
            users.map((u, i) => ({
              select: false,
              index: i + 1,
              user: u.username,
              userId: u.id,
            })),
          );
        } else if (state?.httpRequestStatus === 'error') {
          toast(
            (state.error?.data?.detail as string) ||
              'An unknown error has occurred fetching user list.',
            {type: 'error'},
          );
        }
      }
    },
  });

  const handleCheckboxClick = (user: UserTableItem) => {
    selectedUsers.includes(user.userId)
      ? setSelectedUsers(prev => prev.filter(id => id !== user.userId))
      : setSelectedUsers(prev => [...prev, user.userId]);
  };

  return (
    <Table
      cols={columns}
      items={usersTableItems}
      dynamicColumns={['select']}
      renderDynamicColumn={({value}) => (
        <input
          type="checkbox"
          onChange={() => handleCheckboxClick(value)}
          checked={selectedUsers.includes(value.userId)}
        />
      )}
      containerClassName="w-3/5"
    />
  );
};

export default CreateGroupMembersTable;
