import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {Table} from '~/components';
import {UserRole} from '~/constant/users';
import {useAppSelector, useHttpRequest} from '~/hooks';
import ErrorPage403 from '../errors/403';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  groupName: {label: 'Group Name', size: 'w-[90%]', sort: true},
};

const UserGroupsPage: FC = () => {
  const {userId} = useParams();

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  if (loggedInUser.role !== UserRole.SUPER_USER && loggedInUser.id !== userId) {
    return <ErrorPage403 />;
  }

  const groupsQuery = useHttpRequest({
    selector: state => state.http.userGroupsList,
    initialRequests: request => {
      request('userGroupsList', {params: {user_id: userId!}});
    },
  });

  const items = groupsQuery.state?.data
    ? groupsQuery.state.data.map((group, index) => ({
        index: index + 1,
        groupName: group.name,
      }))
    : [];

  return (
    <>
      <div className="w-2/3 flex-grow">
        {groupsQuery.state?.httpRequestStatus === 'error' ? (
          <p className="text-red-600">
            {(groupsQuery.state.error?.data?.detail as string) ||
              'Encountered an error.'}
          </p>
        ) : (
          <Table
            cols={columns}
            items={items}
            loading={groupsQuery.state?.httpRequestStatus === 'loading'}
          />
        )}
      </div>
    </>
  );
};

export default UserGroupsPage;
