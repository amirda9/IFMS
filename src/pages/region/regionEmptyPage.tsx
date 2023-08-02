import React from 'react';
import {TabItem} from '~/components';
import {Outlet} from 'react-router-dom';

const RegionEmptyPage = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="access" name="Access" />
        <TabItem to="stations" name="Stations" />
        <TabItem to="links" name="Links" />
      </div>
      <Outlet />
    </div>
  );
};

export default RegionEmptyPage;
