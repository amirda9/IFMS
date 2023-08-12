import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useParams} from 'react-router-dom';

const StationEmptyPage = () => {
  const params = useParams<{stationId: string}>();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="access" name="Access" />
      </div>
      <Outlet key={params.stationId} />
    </div>
  );
};

export default StationEmptyPage;
