import React from 'react';
import {TabItem} from '~/components';
import {Outlet} from 'react-router-dom';

const NetworkEmpty = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="access" name="Access" />
        <TabItem to="stations" name="GIS" />
      </div>
      <Outlet />
    </div>
  );
};

export default NetworkEmpty;
