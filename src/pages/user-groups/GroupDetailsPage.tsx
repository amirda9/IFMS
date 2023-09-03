import {FC, useState} from 'react';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Description, SimpleBtn, TextInput} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {useHttpRequest} from '~/hooks';

const GroupDetailsPage: FC = () => {
  const {groupId} = useParams();

  const [groupNameValue, setGroupNameValue] = useState('');

  const {
    request,
    state: {groupDetail, updateGroup},
  } = useHttpRequest({
    selector: state => ({
      groupDetail: state.http.groupDetail,
      updateGroup: state.http.updateGroup,
    }),
    initialRequests: request => {
      request('groupDetail', {params: {group_id: groupId!}});
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.groupDetail?.httpRequestStatus === 'loading' &&
        state.groupDetail?.httpRequestStatus === 'success'
      ) {
        setGroupNameValue(state.groupDetail.data?.name || '');
      }

      if (lastState.updateGroup?.httpRequestStatus === 'loading') {
        if (state.updateGroup?.httpRequestStatus === 'success') {
          toast('Group detail was updated successfully!', {type: 'success'});
          request('groupDetail', {params: {group_id: groupId!}});
          request("groupList", undefined);
        } else if (state.updateGroup?.httpRequestStatus === 'error') {
          if (state.updateGroup.error?.status === 422) {
            toast('Validation Error', {type: 'error'});
          } else {
            toast(
              (state.updateGroup.error?.data?.detail as string) ||
                'An unknown error has occurred.',
              {type: 'error'},
            );
          }
        }
      }
    },
  });

  const handleGroupDetailSave = () => {
    if (!groupDetail?.data) return;

    request('updateGroup', {
      params: {group_id: groupId!},
      data: {
        name: groupNameValue,
        users: groupDetail.data.users.map(u => u.id),
      },
    });
  };

  return (
    <form className="flex flex-grow flex-col justify-between">
      <div className="flex flex-col gap-4">
        {groupDetail?.data ? (
          <>
            <Description label="Name">
              <TextInput
                name="groupName"
                className="disabled:cursor-not-allowed disabled:bg-slate-200 w-3/5"
                value={groupNameValue}
                onChange={e => setGroupNameValue(e.target.value)}
              />
            </Description>
            <Description label="Owner">
              <span>{groupDetail.data.owner?.name || 'N/A'}</span>
            </Description>
            <Description label="Created">
              <span>{groupDetail.data.time_created || 'N/A'}</span>
            </Description>
            <Description label="Last Modified">
              <span>{groupDetail.data.time_updated || 'N/A'}</span>
            </Description>
          </>
        ) : (
          <GeneralLoadingSpinner />
        )}
      </div>
      <div className="flex flex-row self-end gap-x-4">
        <SimpleBtn
          disabled={
            !groupDetail?.data || updateGroup?.httpRequestStatus === 'loading'
          }
          onClick={handleGroupDetailSave}>
          {!groupDetail?.data || updateGroup?.httpRequestStatus === 'loading'
            ? 'Please wait...'
            : 'Save'}
        </SimpleBtn>
        <SimpleBtn link to="..">
          Cancel
        </SimpleBtn>
      </div>
    </form>
  );
};

export default GroupDetailsPage;
