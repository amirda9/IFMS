
import {TabItem} from '~/components';
import {Outlet, useParams, useSearchParams} from 'react-router-dom';

const AlarmEmpty = () => {
  const params = useParams<{alarmId: string}>();
  const [searchparams] = useSearchParams();
  const idLisString = searchparams.get('id_lis');
  const idLisArray = idLisString && idLisString.split(',');

  return (
    <div className="flex h-full w-full flex-col pt-20 px-6">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to={`/monitoring/alarms/alarmdetail?id_lis=${idLisArray}`} name="Detail"/>
        {/* {datadetailStatus ? ( */}
          <>
            <TabItem to={`/monitoring/alarms/alarmdetail/alarms?id_lis=${idLisArray}`} name="Alarms" />
          </>
        {/* // ) : null} */}
      </div>
      <Outlet key={params.alarmId} />
    </div>
  );
};

export default AlarmEmpty;