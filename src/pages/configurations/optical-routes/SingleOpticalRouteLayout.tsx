import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

const SingleOpticalRouteLayout: FC = () => {
  const params = useParams();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        <TabItem to="route" name="Route" />
        <TabItem to="test-setup" name="Test Setup" />
        <TabItem to="test-history" name="Test History" />
      </div>

      <Outlet key={params.opticalRouteId} />
    </div>
  );
};

export default SingleOpticalRouteLayout;
