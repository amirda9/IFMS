import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {Table} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
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
    : null;

  console.log(groupsQuery);

  return (
    <div className="w-2/3">
      {groupsQuery.state?.httpRequestStatus === 'success' && items ? (
        <Table cols={columns} items={items} />
      ) : groupsQuery.state?.httpRequestStatus === 'loading' ? (
        <GeneralLoadingSpinner />
      ) : (
        <p className="text-red-600">Encountered an error.</p> //TODO: Find out the error format and show the actual error message
      )}
    </div>
  );
};

export default UserGroupsPage;
