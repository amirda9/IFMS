import {TabItem} from '~/components';

import {
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {IoArrowBackCircleSharp} from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {alarmApi} from '../../../store/slices/alarm/alarmapislice'
const AlarmEmpty = () => {
  const params = useParams<{alarmId: string}>();
  const dispatch = useDispatch();
  const location = useLocation();
  const idLisString = location.state?.id_list!;
  const idLisArray = idLisString;
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col px-6 pt-20">
      <div className="flex w-full flex-row justify-between">
        <div className="mb-8 flex h-fit w-[300px]  [&_*]:mx-[0.5px]">
          <TabItem
            activelink={'/monitoring/alarms/alarmdetail'}
            onClick={() =>
              navigate('/monitoring/alarms/alarmdetail', {
                state: {id_list: idLisArray},
              })
            }
            to={`/monitoring/alarms/alarmdetail?id_lis=${idLisArray}`}
            name="Summary"
          />
          {/* {datadetailStatus ? ( */}
          <>
            <TabItem
              activelink={'/monitoring/alarms/alarmdetail/alarms'}
              onClick={() =>
                navigate('/monitoring/alarms/alarmdetail/alarms', {
                  state: {id_list: idLisArray},
                })
              }
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
