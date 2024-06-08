import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useLocation, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

const StationEmptyPage = () => {
  const params = useParams<{stationId: string}>();
  const path = useLocation();
  console.log('path', path);
  const {datadetailStatus} = useSelector((state: any) => state.networktree);

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-6 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem
          to={`${
            path.pathname.includes(`defaultstationDetailPage`)
              ? 'defaultstationDetailPage'
              : '.'
          }`}
          name="Detail"
        />
        {datadetailStatus ? (
          <TabItem
            to={`${
              path.pathname.includes(`defaultstationDetailPage`)
                ? 'access/defaultstationDetailPage'
                : 'access'
            }`}
            name="Access"
          />
        ) : null}
      </div>
      <Outlet key={params.stationId} />
    </div>
  );
};

export default StationEmptyPage;
