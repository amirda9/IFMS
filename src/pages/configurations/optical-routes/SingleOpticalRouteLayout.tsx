import {FC} from 'react';
import {useSelector} from 'react-redux';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';
import {UserRole} from '~/constant/users';
import {useAppSelector} from '~/hooks';
import {RootState} from '~/store';

const SingleOpticalRouteLayout: FC = () => {
  const params = useParams();
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {opticalroutenetworkadmin} = useSelector(
    (state: RootState) => state.opticalroute
  );
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        {loggedInUser.role === UserRole.SUPER_USER ||
        opticalroutenetworkadmin.includes(params?.networkId!) ? (
          <>
            <TabItem to="route" name="Route" />
            <TabItem to="test-setup" name="Test Setup" />
            <TabItem to="test-history" name="Test History" />
          </>
        ) : null}
      </div>

      <Outlet key={params.opticalRouteId} />
    </div>
  );
};

export default SingleOpticalRouteLayout;
