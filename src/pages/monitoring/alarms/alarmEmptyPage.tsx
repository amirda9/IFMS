import {TabItem} from '~/components';
import {
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import {IoArrowBackCircleSharp} from 'react-icons/io5';
const AlarmEmpty = () => {
  const params = useParams<{alarmId: string}>();
  const [searchparams] = useSearchParams();
  const idLisString = searchparams.get('id_lis');
  const idLisArray = idLisString && idLisString.split(',');
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col px-6 pt-20">
      <div className="flex w-full flex-row justify-between">
        <div className="mb-8 flex h-fit w-[300px]  [&_*]:mx-[0.5px]">
          <TabItem
            to={`/monitoring/alarms/alarmdetail?id_lis=${idLisArray}`}
            name="Summary"
          />
          {/* {datadetailStatus ? ( */}
          <>
            <TabItem
              to={`/monitoring/alarms/alarmdetail/alarms?id_lis=${idLisArray}`}
              name="Alarms"
            />
          </>
          {/* // ) : null} */}
        </div>
        <IoArrowBackCircleSharp
          className="cursor-pointer"
          onClick={() => navigate('/monitoring/alarms')}
          color="#006BBC"
          size={45}
        />
      </div>

      <Outlet key={params.alarmId} />
    </div>
  );
};

export default AlarmEmpty;
