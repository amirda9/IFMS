import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useParams} from 'react-router-dom';

const RegionEmptyPage = () => {
  const params = useParams<{regionId: string}>();
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="access" name="Access" />
        <TabItem to="stations" name="Stations" />
        <TabItem to="links" name="Links" />
      </div>
      <Outlet key={params.regionId} />
    </div>
  );
};

export default RegionEmptyPage;
