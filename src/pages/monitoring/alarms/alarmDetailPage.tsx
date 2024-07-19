import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSearchParams} from 'react-router-dom';
import {TextInput} from '~/components';
import {RootState} from '~/store';
import {changealarmstatus, setAllalarmdata} from '~/store/slices/alarmsslice';
import {$Post} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';

const AlarmRow = ({title, data}: {title: string; data: string | number}) => {
  return (
    <div className="mb-5 flex flex-row items-center justify-between">
      <span className="text-[20px]  font-normal leading-[24.2px]">{title}</span>
      <TextInput
      onChange={()=>{}}
        defaultValue={data}
        value={data}
        className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
      />
    </div>
  );
};

function AlarmDetailPage() {
  const {allalarmdata, alarmstatus} = useSelector(
    (state: RootState) => state.alarmsslice,
  );
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchparams] = useSearchParams();
  const idLisString = searchparams.get('id_lis');
  const idLisArray = idLisString && idLisString.split(',');

  useEffect(() => {
    if (!alarmstatus) {
      const geralarmsdetail = async () => {
        try {
          setLoading(true);
          const response = await $Post(`otdr/alarm/events/details`, idLisArray);

          if (response?.status == 200) {
            const responsedata = await response?.json();
            dispatch(changealarmstatus(true));
            dispatch(setAllalarmdata(responsedata));
          }
        } catch (error) {
          console.log(`get alarms detail error:${error}`);
        } finally {
          setLoading(false);
        }
      };
      geralarmsdetail();
    }
  }, []);

  const detail = allalarmdata?.details;
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="flex w-full flex-row justify-between">
      <div className="flex w-[45%] flex-col">
        <AlarmRow title="Alarm Type" data="Link" />
        <AlarmRow title="State" data={detail?.status || ''} />
        <AlarmRow title="Network" data={detail?.network_name || ''} />
        <AlarmRow title="Link" data={detail?.link_name || ''} />
        <AlarmRow title="Cable" data={detail?.cable || ''} />
        <AlarmRow title="Core" data={detail?.core || 0} />
        <AlarmRow
          title="To Escalation"
          data={`${detail?.to_escalation?.days || 0} Day - ${
            detail?.to_escalation?.hours || 0
          } Hours - ${detail?.to_escalation?.minutes || 0} Minutes`}
        />
        <AlarmRow
          title="Alarm Time"
          data={getPrettyDateTime(detail?.time_created) || ''}
        />
      </div>
      <div className="flex w-[45%] flex-col">
        <AlarmRow title="Severity" data={detail?.severity || ''} />
        <AlarmRow title="# Alarms" data={detail?.alarm_number || 0} />
        <AlarmRow title="Region" data={detail?.region_name || ''} />
        <AlarmRow title="Station" data={detail?.rtu_name || ''} />
        <AlarmRow title="RTU" data={detail?.rtu_name || ''} />
        <AlarmRow title="Port" data={detail?.port || ''} />
        <AlarmRow
          title="To Time Out"
          data={`${detail?.to_time_out?.days || 0} Day - ${
            detail?.to_time_out?.hours || 0
          } Hours - ${detail?.to_time_out?.minutes || 0} Minutes`}
        />
        <AlarmRow
          title="Last Modified"
          data={getPrettyDateTime(detail?.time_modified) || ''}
        />
      </div>
    </div>
  );
}

export default AlarmDetailPage;
