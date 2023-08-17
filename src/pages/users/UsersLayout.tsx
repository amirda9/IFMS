import {FC} from 'react';
import {SidebarItem} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const UsersPage: FC = () => {
  const userListQuery = useHttpRequest({
    selector: state => state.http.userList,
    initialRequests: (request, _state) => {
      request('userList', undefined);
    },
  });

  console.log(userListQuery);

  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Users">
      {userListQuery.state &&
      userListQuery.state.httpRequestStatus === 'success' ? (
        userListQuery.state.data!.map(user => (
          <SidebarItem
            name={user.username}
            to={user.username}
            key={user.username}
          />
        ))
      ) : (
        <GeneralLoadingSpinner />
      )}
    </SidebarLayout>
  );
};

export default UsersPage;
