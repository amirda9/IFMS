import {FC, useEffect} from 'react';
import {toast} from 'react-toastify';
import {SidebarItem} from '~/components';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const UserGroupsLayout: FC = () => {
  const groupsListQuery = useHttpRequest({
    selector: state => state.http.groupList,
    initialRequests: (request, _state) => {
      request('groupList', undefined);
    },
  });

  useEffect(() => {
    if (groupsListQuery.state?.error) {
      if (groupsListQuery.state?.error.status === 422) {
      } else {
        toast(groupsListQuery.state?.error.data?.detail as string, {
          type: 'error',
        });
      }
    }
  }, [groupsListQuery.state]);

  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Groups">
      {groupsListQuery.state?.httpRequestStatus === 'success' ? (
        groupsListQuery.state.data!.map(group => (
          <SidebarItem name={group.name} to={group.id} key={group.id} />
        ))
      ) : groupsListQuery.state?.httpRequestStatus === 'loading' ? (
        <GeneralLoadingSpinner />
      ) : (
        <></>
      )}
    </SidebarLayout>
  );
};

export default UserGroupsLayout;
