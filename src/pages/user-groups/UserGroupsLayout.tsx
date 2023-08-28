import {FC, useEffect, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import {SidebarItem} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const UserGroupsLayout: FC = () => {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const selectedGroupToDelete = useRef<string | null>(null);

  const {
    request,
    state: {groupList, deleteGroup},
  } = useHttpRequest({
    selector: state => ({
      groupList: state.http.groupList,
      deleteGroup: state.http.deleteGroup,
    }),
    initialRequests: (request, _state) => {
      request('groupList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (state.groupList?.error) {
        if (state.groupList?.error.status === 422) {
        } else {
          toast(state.groupList?.error.data?.detail as string, {
            type: 'error',
          });
        }
      }

      if (lastState.deleteGroup?.httpRequestStatus === 'loading') {
        if (state.deleteGroup?.httpRequestStatus === 'success') {
          toast('Group was deleted successfully.', {type: 'success'});
          request('groupList', undefined);
        } else if (state.deleteGroup?.httpRequestStatus === 'error') {
          toast(
            (state.deleteGroup.error?.data?.detail as string) ||
              'An unknown error has occurred.',
            {type: 'error'},
          );
        }
      }
    },
  });

  const onGroupDeleteClick = () => {
    request('deleteGroup', {
      params: {group_id: selectedGroupToDelete.current as string},
    });
    setDeleteConfirmationOpen(false);
  };

  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Groups" canAdd>
      {groupList?.httpRequestStatus === 'success' ? (
        groupList.data!.map(group => (
          <SidebarItem
            name={group.name}
            to={group.id}
            key={group.id}
            onDelete={() => {
              selectedGroupToDelete.current = group.id;
              setDeleteConfirmationOpen(true);
            }}
          />
        ))
      ) : groupList?.httpRequestStatus === 'loading' ? (
        <GeneralLoadingSpinner />
      ) : (
        <></>
      )}

      <ConfirmationModal
        open={deleteConfirmationOpen}
        setOpen={setDeleteConfirmationOpen}
        title="Delete Group"
        description="Are you sure you want to delete this group?"
        type="danger"
        onPrimaryClick={onGroupDeleteClick}
        primaryButtonText="Delete"
      />
    </SidebarLayout>
  );
};

export default UserGroupsLayout;
