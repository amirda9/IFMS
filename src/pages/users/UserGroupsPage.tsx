import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  groupName: {label: 'Group Name', size: 'w-[90%]', sort: true},
};

const UserGroupsPage: FC = () => {
  const {userId} = useParams();

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
