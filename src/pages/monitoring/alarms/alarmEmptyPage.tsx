import React from 'react';
import {TabItem} from '~/components';
import {Outlet, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';

const AlarmEmpty = () => {
  const params = useParams<{alarmId: string}>();
  const {datadetailStatus} = useSelector((state: any) => state.networktree);

  return (
    <div className="flex h-full w-full flex-col pt-20 px-6">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to={`/monitoring/alarms/${params.alarmId}`} name="Detail"/>
        {/* {datadetailStatus ? ( */}
          <>
            <TabItem to={`/monitoring/alarms/${params.alarmId}/alarms`} name="Alarms" />
          </>
        {/* // ) : null} */}
      </div>
      <Outlet key={params.alarmId} />
    </div>
  );
};

export default AlarmEmpty;