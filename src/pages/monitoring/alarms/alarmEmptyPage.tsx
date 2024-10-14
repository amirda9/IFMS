
import {TabItem} from '~/components';
import {Outlet, useParams, useSearchParams} from 'react-router-dom';
import { IoArrowBackCircleSharp } from "react-icons/io5";
const AlarmEmpty = () => {
  const params = useParams<{alarmId: string}>();
  const [searchparams] = useSearchParams();
  const idLisString = searchparams.get('id_lis');
  const idLisArray = idLisString && idLisString.split(',');

  return (
    <div className="flex h-full w-full flex-col pt-20 px-6">
      <div className='flex flex-row w-full justify-between'>
      <div className="mb-8 flex w-[300px] h-fit  [&_*]:mx-[0.5px]">
        <TabItem to={`/monitoring/alarms/alarmdetail?id_lis=${idLisArray}`} name="Detail"/>
        {/* {datadetailStatus ? ( */}
          <>
            <TabItem to={`/monitoring/alarms/alarmdetail/alarms?id_lis=${idLisArray}`} name="Alarms" />
          </>
        {/* // ) : null} */}
      </div>
      <IoArrowBackCircleSharp onClick={()=>{}} color="bg-blue-200" size={45} />
      </div>
     
      <Outlet key={params.alarmId} />
    </div>
  );
};

export default AlarmEmpty;