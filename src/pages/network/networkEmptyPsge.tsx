import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

const NetworkEmpty = () => {
  const params = useParams<{networkId: string}>();
  const {datadetailStatus} = useSelector((state: any) => state.networktree);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        {datadetailStatus ? (
          <>
            <TabItem to="access" name="Access" />
            <TabItem to="gis" name="GIS" />
          </>
        ) : null}
      </div>
      <Outlet key={params.networkId} />
    </div>
  );
};

export default NetworkEmpty;
