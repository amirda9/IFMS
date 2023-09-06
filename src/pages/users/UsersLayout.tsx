import {FC, useState} from 'react';
import {SidebarItem} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import {UserRole} from '~/constant/users';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const UsersLayout: FC = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

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
      canAdd={loggedInUser.role === UserRole.SUPER_USER}
      addButtonLink="register"
      hideSidebar={isEditingUserAccess}>
      <SidebarItem
        name={loggedInUser.username + ' (You)'}
        to={loggedInUser.id}
        key={loggedInUser.id}
      />

      {userListQuery.state &&
      userListQuery.state.httpRequestStatus === 'success' ? (
        userListQuery.state.data!.map(user => (
          <SidebarItem
            name={user.username}
            to={user.id}
            key={user.id}
            onDelete={
              loggedInUser.role === UserRole.SUPER_USER
                ? handleDeleteButtonClick
                : undefined
            }
          />
        ))
      ) : userListQuery.state &&
        userListQuery.state.httpRequestStatus === 'loading' ? (
        <GeneralLoadingSpinner />
      ) : (
        <></>
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

export default UsersLayout;
