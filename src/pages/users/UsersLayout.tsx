import {FC, useState} from 'react';
import {SidebarItem} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const UsersPage: FC = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const userListQuery = useHttpRequest({
    selector: state => state.http.userList,
    initialRequests: (request, _state) => {
      request('userList', undefined);
    },
  });

  const handleDeleteButtonClick = () => {
    setDeleteModalOpen(true);
  };

  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Users">
      {userListQuery.state &&
      userListQuery.state.httpRequestStatus === 'success' ? (
        userListQuery.state.data!.map(user => (
          <SidebarItem
            name={user.username}
            to={user.id}
            key={user.id}
            onDelete={handleDeleteButtonClick}
          />
        ))
      ) : (
        <GeneralLoadingSpinner />
      )}

      <ConfirmationModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        title="User Deletion"
        description="Are you sure you want to delete this user? This action is irreversible!"
        primaryButtonText='Delete'
        type='danger'
      />
    </SidebarLayout>
  );
};

export default UsersPage;
