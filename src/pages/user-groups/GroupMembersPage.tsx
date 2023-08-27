import {FC, useState} from 'react';
import {useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import EditGroupMembers from './EditGroupMembers';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const GroupMembersPage: FC = () => {
  const {groupId} = useParams();

  const [isEditingMembers, setIsEditingMembers] = useState(false);

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
    <>
      <div className="flex flex-col flex-grow gap-y-10">
        {isEditingMembers ? (
          <EditGroupMembers
            groupId={groupId!}
            setIsEditingMembers={setIsEditingMembers}
          />
        ) : (
          <Table
            cols={columns}
            items={items}
            loading={groupDetailQuery.state?.httpRequestStatus === 'loading'}
            width="w-3/5"
            height="h-auto"
          />
        )}
      </div>
      {!isEditingMembers && (
        <div className="self-end">
          <SimpleBtn
            onClick={() => {
              setIsEditingMembers(true);
            }}>
            Edit Members
          </SimpleBtn>
        </div>
      )}
    </>
  );
};

export default GroupMembersPage;
