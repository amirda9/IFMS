import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

const AlarmEmpty = () => {
  const params = useParams<{networkId: string}>();
  const {datadetailStatus} = useSelector((state: any) => state.networktree);

  return (
    <div className="flex h-full w-full flex-col pt-20 px-6">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="." name="Detail" />
        {/* {datadetailStatus ? ( */}
          <>
            <TabItem to="access" name="Alarms" />
          </>
        {/* // ) : null} */}
      </div>
      <Outlet key={params.networkId} />
    </div>
  );
};

export default AlarmEmpty;