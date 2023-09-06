import {FC, useState} from 'react';
import {SidebarItem} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import {UserRole} from '~/constant/users';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const UsersPage: FC = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const userRole = useAppSelector(state => state.http.verifyToken?.data?.role);
  const userAccessType = useAppSelector(
    state => state.http.verifyToken?.data?.is_admin,
  );

  console.log(userRole, userAccessType);

  const isEditingUserAccess = useAppSelector(
    state => state.userAccess.isEditingUserAccess,
  );

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
    <SidebarLayout
      searchOnChange={() => {}}
      createTitle="Users"
      canAdd={userRole === UserRole.SUPER_USER}
      addButtonLink="register"
      hideSidebar={isEditingUserAccess}>
      {userListQuery.state &&
      userListQuery.state.httpRequestStatus === 'success' ? (
        userListQuery.state.data!.map(user => (
          <SidebarItem
            name={user.username}
            to={user.id}
            key={user.id}
            onDelete={
              userRole === UserRole.SUPER_USER
                ? handleDeleteButtonClick
                : undefined
            }
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
        primaryButtonText="Delete"
        type="danger"
      />
    </SidebarLayout>
  );
};

export default UsersPage;
