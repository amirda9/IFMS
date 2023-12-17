import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

const SinglereportsscheduleRouteLayout: FC = () => {
  const params = useParams();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        <TabItem to="schedulereports" name="Reports" />
        <TabItem to="reportsscheduleUsers" name="Users" />

      </div>

      <Outlet key={params.opticalRouteId} />
    </div>
  );
};

export default SinglereportsscheduleRouteLayout;
