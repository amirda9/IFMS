import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {Table} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {useHttpRequest} from '~/hooks';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const GroupMembersPage: FC = () => {
  const {groupId} = useParams();

  const groupDetailQuery = useHttpRequest({
    selector: state => state.http.groupDetail,
    initialRequests: request => {
      request('groupDetail', {params: {group_id: groupId!}});
    },
  });

  const items = groupDetailQuery.state?.data
    ? groupDetailQuery.state.data.users.map((user, index) => ({
        index: index + 1,
        user: user.username,
        region: user.region?.name || 'N/A',
        station: user.station?.name || 'N/A',
      }))
    : [];

  return (
    <div>
      <Table
        cols={columns}
        items={items}
        loading={groupDetailQuery.state?.httpRequestStatus === 'loading'}
      />
    </div>
  );
};

export default GroupMembersPage;
