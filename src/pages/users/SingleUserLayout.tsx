import {FC} from 'react';
import {Outlet, useLocation, useParams} from 'react-router-dom';
import {TabItem} from '~/components';
import {UserRole} from '~/constant/users';
import {useAppSelector} from '~/hooks';

const SingleUserLayout: FC = () => {
  const params = useParams();

  const location = useLocation();

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  return (
    <div className="flex h-full w-full flex-col">
      {!location.state?.isEditingUserAccess && (
        <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
          <TabItem to="." name="Details" />

          {(loggedInUser.role === UserRole.SUPER_USER ||
            loggedInUser.id === params.userId) && (
            <>
              <TabItem to="access" name="Access" />

              <TabItem to="groups" name="Groups" />

              <TabItem to="sessions" name="Sessions" />

              <TabItem to="authentication" name="Authentication" />
            </>
          )}

        </div>
      )}
      <Outlet key={params.username} />
    </div>
  );
};

export default SingleUserLayout;
