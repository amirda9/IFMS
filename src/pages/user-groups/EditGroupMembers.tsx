import {FC, useState} from 'react';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {useAppDispatch, useHttpRequest} from '~/hooks';
import {userGroupsActions} from '~/store/slices';
import {UserListType} from '~/types';

const columns = {
  select: {label: '', size: 'w-[5%]'},
  index: {label: '#', size: 'w-[10%]'},
  username: {label: 'User'},
  region: {label: 'Region'},
  station: {label: 'Station'},
};

type MemberTableItem = {
  select: boolean;
  index: number;
  username: string;
  userId: string;
  region: string;
  station: string;
};

type Props = {
  groupId: string;
};

const userToTableItem = (users: UserListType[]): MemberTableItem[] => {
  return users.map((m, index) => ({
    select: false,
    index: index + 1,
    username: m.username,
    userId: m.id,
    region: m.region?.name || 'N/A',
    station: m.station?.name || 'N/A',
  }));
};

const EditGroupMembers: FC<Props> = ({groupId}) => {
  const dispatch = useAppDispatch();

  const [membersList, setMembersList] = useState<MemberTableItem[]>([]);
  const [nonMembersList, setNonMembersList] = useState<MemberTableItem[]>([]);

  const [selectedMembersList, setSelectedMembersList] = useState<string[]>([]);
  const [selectedNonMembersList, setSelectedNonMembersList] = useState<
    string[]
  >([]);

  const {
    state: {groupDetail, userList},
    request,
  } = useHttpRequest({
    selector: state => ({
      userList: state.http.userList,
      groupDetail: state.http.groupDetail,
      updateGroup: state.http.updateGroup,
    }),
    initialRequests: request => {
      request('userList', undefined);
      request('groupDetail', {params: {group_id: groupId}});
    },
    onUpdate: (lastState, state) => {
      if (state.userList?.httpRequestStatus === 'success') {
        const allUsers = state.userList.data || [];

        if (state.groupDetail?.httpRequestStatus === 'success') {
          const members = state.groupDetail.data?.users || [];

          setMembersList(userToTableItem(members));

          const nonMembers = allUsers.filter(
            user => !members.find(m => m.id === user.id),
          );

          setNonMembersList(userToTableItem(nonMembers));
        }
      }
      if (lastState.updateGroup?.httpRequestStatus === 'loading') {
        if (state.updateGroup?.httpRequestStatus === 'success') {
          request('groupDetail', {params: {group_id: groupId}});

          toast('Members updated successfully!', {type: 'success'});

          dispatch(userGroupsActions.setIsEditingGroupMembers(false));
        } else if (state.updateGroup?.httpRequestStatus === 'error') {
          toast(
            (state.updateGroup.error?.data?.detail as string) ||
              'Unknown error has occurred!',
            {type: 'error'},
          );
        }
      }
    },
  });

  const handleMemberSelect = (
    item: MemberTableItem,
    type: 'NON_MEMBER' | 'MEMBER',
  ) => {
    if (type === 'MEMBER') {
      selectedMembersList.includes(item.userId)
        ? setSelectedMembersList(prv => prv.filter(u => u !== item.userId))
        : setSelectedMembersList(prv => [...prv, item.userId]);
    } else if (type === 'NON_MEMBER') {
      selectedNonMembersList.includes(item.userId)
        ? setSelectedNonMembersList(prv => prv.filter(u => u !== item.userId))
        : setSelectedNonMembersList(prv => [...prv, item.userId]);
    }
  };

  const handleMemberAddClick = () => {
    setMembersList(prvMembers =>
      prvMembers.concat(
        nonMembersList.filter(m => selectedNonMembersList.includes(m.userId)),
      ),
    );
    setNonMembersList(prv =>
      prv.filter(u => !selectedNonMembersList.includes(u.userId)),
    );
    setSelectedNonMembersList([]);
  };

  const handleMemberRemoveClick = () => {
    setNonMembersList(prvMembers =>
      prvMembers.concat(
        membersList.filter(m => selectedMembersList.includes(m.userId)),
      ),
    );
    setMembersList(prv =>
      prv.filter(u => !selectedMembersList.includes(u.userId)),
    );
    setSelectedMembersList([]);
  };

  const handleSaveClick = () => {
    const newMemberIds = membersList.map(member => member.userId);
    request('updateGroup', {
      params: {group_id: groupId},
      data: {name: groupDetail?.data?.name || '', users: newMemberIds},
    });
  };

  return (
    <>
      <div className="flex flex-grow items-center gap-x-4">
        <Table
          cols={columns}
          items={nonMembersList}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleMemberSelect(value, 'NON_MEMBER')}
              checked={selectedNonMembersList.includes(value.userId)}
            />
          )}
          loading={
            userList?.httpRequestStatus === 'loading' ||
            groupDetail?.httpRequestStatus === 'loading'
          }
          containerClassName="flex-grow h-full"
        />
        <DoubleSideButtonGroup
          onClickRightButton={handleMemberAddClick}
          onClickLeftButton={handleMemberRemoveClick}
        />
        <Table
          cols={columns}
          items={membersList}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleMemberSelect(value, 'MEMBER')}
              checked={selectedMembersList.includes(value.userId)}
            />
          )}
          loading={
            userList?.httpRequestStatus === 'loading' ||
            groupDetail?.httpRequestStatus === 'loading'
          }
          containerClassName="flex-grow h-full"
        />
      </div>
      <div className="flex gap-x-4 self-end">
        <SimpleBtn onClick={handleSaveClick}>Save</SimpleBtn>
        <SimpleBtn
          onClick={() => {
            dispatch(userGroupsActions.setIsEditingGroupMembers(false));
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default EditGroupMembers;
