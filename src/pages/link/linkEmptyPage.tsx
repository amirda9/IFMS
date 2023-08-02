import React from 'react';
import {TabItem} from '~/components';
import {Outlet} from 'react-router-dom';

const LinkEmptyPage = () => {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        <TabItem to="access" name="Access" />
        <TabItem to="cables-segments" name="Cables & Segments" className={"w-40"}/>
        <TabItem to="points" name="Points" />
      </div>
      <Outlet />
    </div>
  );
};

export default LinkEmptyPage;
