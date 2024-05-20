import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useLocation, useParams} from 'react-router-dom';

const StationEmptyPage = () => {
  const params = useParams<{stationId: string}>();
  const path=useLocation()
console.log("path",path);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-6 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to={`${path.pathname.includes(`defaultstationDetailPage`)?"defaultstationDetailPage":"."}`} name="Detail" />
        <TabItem to={`${path.pathname.includes(`defaultstationDetailPage`)?"access/defaultstationDetailPage":"access"}`} name="Access" />
      </div>
      <Outlet key={params.stationId} />
    </div>
  );
};

export default StationEmptyPage;
