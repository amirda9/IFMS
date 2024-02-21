import {FC} from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {TabItem} from '~/components';

const SingleAlarmTypeLayout: FC = () => {
  const params = useParams();

  return (
    <div className="flex h-full w-full flex-col">
      <div className="mb-8 flex h-fit [&_*]:mx-[0.5px]">
        <TabItem to="." name="Details" />
        <TabItem to="definition" name="Alarm Definition" />
        <TabItem to="content" name="Alarm Content" />
        <TabItem to="alert-sending" name="Alert Sending" />
        <TabItem to="automatic-events" name="Automatic Events" />
        <TabItem to="access" name="Access" />
        <TabItem to="alert-networks" name="Networks" />
      </div>

      <Outlet key={params.alarmId} />
    </div>
  );
};

export default SingleAlarmTypeLayout;
