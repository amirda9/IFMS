import {FC} from 'react';
import {useParams} from 'react-router-dom';
import {SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import EditGroupMembers from './EditGroupMembers';
import {useDispatch} from 'react-redux';
import {userGroupsActions} from '~/store/slices';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const GroupMembersPage: FC = () => {
  const dispatch = useDispatch();

  const {groupId} = useParams();

  const isEditingGroupMembers = useAppSelector(
    state => state.userGroups.isEditingGroupMembers,
  );

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
      <div className="flex flex-grow flex-col gap-y-10">
        {isEditingGroupMembers ? (
          <EditGroupMembers groupId={groupId!} />
        ) : (
          <Table
            cols={columns}
            items={items}
            loading={groupDetailQuery.state?.httpRequestStatus === 'loading'}
            containerClassName="w-3/5"
          />
        )}
      </div>
      {!isEditingGroupMembers && (
        <div className="flex flex-row gap-x-4 self-end">
          <SimpleBtn
            onClick={() => {
              dispatch(userGroupsActions.setIsEditingGroupMembers(true));
            }}>
            Edit Members
          </SimpleBtn>
          <SimpleBtn link to="../../">
            Cancel
          </SimpleBtn>
        </div>
      )}
    </>
  );
};

export default GroupMembersPage;
