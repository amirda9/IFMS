import { FC } from "react"
import { SidebarItem } from "~/components";
import GeneralLoadingSpinner from "~/components/loading/GeneralLoadingSpinner";
import { useHttpRequest } from "~/hooks";
import { SidebarLayout } from "~/layout";

const UserGroupsLayout:FC = () => {
  const groupsListQuery = useHttpRequest({
    selector: state => state.http.groupList,
    initialRequests: (request, _state) => {
      request('groupList', undefined);
    },
  });

  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Groups">
      {groupsListQuery.state &&
      groupsListQuery.state.httpRequestStatus === 'success' ? (
        groupsListQuery.state.data!.map(group => (
          <SidebarItem name={group.name} to={group.id} key={group.id} />
        ))
      ) : (
        <GeneralLoadingSpinner />
      )}
    </SidebarLayout>
  );
}

export default UserGroupsLayout