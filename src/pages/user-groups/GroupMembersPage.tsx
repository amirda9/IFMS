import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import ErrorPage403 from '../errors/403';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const GroupMembersPage: FC = () => {
  const {groupId} = useParams();
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

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

    if(loggedInUser?.id != groupDetailQuery?.state?.data?.owner?.id){
      return <ErrorPage403 />
     }
  return (
    <>
      <div className="flex flex-grow flex-col gap-y-10">
        <Table
          cols={columns}
          items={items}
          loading={groupDetailQuery.state?.httpRequestStatus === 'loading'}
          containerClassName="w-3/5"
        />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="../edit-members">
          Edit Members
        </SimpleBtn>
        <SimpleBtn link to="../../">
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default GroupMembersPage;
