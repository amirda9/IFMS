import {FC, useEffect} from 'react';
import {Select, SimpleBtn} from '~/components';
import ScheduleSelector from './ScheduleSelector';
import {useDispatch, useSelector} from 'react-redux';
import {
  setSelectedautomaticevent,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
import {$Put} from '~/util/requestapi';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

const AlarmTypeEventPage: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {alarmtypedetail, selectedautomaticevents} = useSelector(
    (state: RootState) => state.alarmtypes,
  );

useEffect(()=>{
  const selectedautomaticeventsCopy=deepcopy(selectedautomaticevents)
if(alarmtypedetail.automatic_events.escalate_alarm.escalate_acknowledged_after){
  selectedautomaticeventsCopy.push("escalate_acknowledged_after")
}
if(alarmtypedetail.automatic_events.escalate_alarm.escalate_pending_after){
  selectedautomaticeventsCopy.push("escalate_pending_after")
}

if(alarmtypedetail.automatic_events.escalate_alarm.severity_at_least){
  selectedautomaticeventsCopy.push("severity_at_least")
}

if(alarmtypedetail.automatic_events.escalate_alarm.severity_at_least){
  selectedautomaticeventsCopy.push("severity_at_least")
}

if(alarmtypedetail.automatic_events.timeout_alarm.timeout_acknowledged_after){
  selectedautomaticeventsCopy.push("timeout_acknowledged_after")
}

if(alarmtypedetail.automatic_events.timeout_alarm.timeout_pending_after){
  selectedautomaticeventsCopy.push("timeout_pending_after")
}
if(alarmtypedetail.automatic_events.delete_alarm.delete_in_progress_after){
  selectedautomaticeventsCopy.push("delete_in_progress_after")
}
if(alarmtypedetail.automatic_events.delete_alarm.delete_resolved_after){
  selectedautomaticeventsCopy.push("delete_resolved_after")
}
if(alarmtypedetail.automatic_events.delete_alarm.delete_timeout_after){
  selectedautomaticeventsCopy.push("delete_timeout_after")
}
dispatch(setSelectedautomaticevent(selectedautomaticeventsCopy))
},[])

  const updateevents = async () => {
    const escalate_alarm = {
      ...(selectedautomaticevents.findIndex(
        data => data == 'severity_at_least',
      ) > -1 && {
        severity_at_least:
          alarmtypedetail.automatic_events.escalate_alarm.severity_at_least,
      }),
      ...(selectedautomaticevents.findIndex(
        data => data == 'escalate_pending_after',
      ) > -1 && {
        escalate_pending_after:
          alarmtypedetail.automatic_events.escalate_alarm
            .escalate_pending_after,
      }),
      ...(selectedautomaticevents.findIndex(
        data => data == 'escalate_acknowledged_after',
      ) > -1 && {
        escalate_acknowledged_after:
          alarmtypedetail.automatic_events.escalate_alarm
            .escalate_acknowledged_after,
      }),
    };

    const timeout_alarm = {
      ...(selectedautomaticevents.findIndex(
        data => data == 'timeout_pending_after',
      ) > -1 && {
        timeout_pending_after:
          alarmtypedetail.automatic_events.timeout_alarm.timeout_pending_after,
      }),
      ...(selectedautomaticevents.findIndex(
        data => data == 'timeout_acknowledged_after',
      ) > -1 && {
        timeout_acknowledged_after:
          alarmtypedetail.automatic_events.timeout_alarm
            .timeout_acknowledged_after,
      }),
    };

    const delete_alarm = {
      ...(selectedautomaticevents.findIndex(
        data => data == 'delete_resolved_after',
      ) > -1 && {
        delete_resolved_after:
          alarmtypedetail.automatic_events.delete_alarm.delete_resolved_after,
      }),

      ...(selectedautomaticevents.findIndex(
        data => data == 'delete_in_progress_after',
      ) > -1 && {
        delete_in_progress_after:
          alarmtypedetail.automatic_events.delete_alarm
            .delete_in_progress_after,
      }),
      ...(selectedautomaticevents.findIndex(
        data => data == 'delete_timeout_after',
      ) > -1 && {
        delete_timeout_after:
          alarmtypedetail.automatic_events.delete_alarm.delete_timeout_after,
      }),
    };
    const automatic_events = {
      escalate_alarm,
      timeout_alarm,
      delete_alarm,
    };
    console.log('automatic_events', automatic_events);

    const response = await $Put(`otdr/alarm/${params.alarmId}`, {
      automatic_events: automatic_events,
    });
    if (response.status == 201) {
      toast('با موفقیت انجام شد', {type: 'success', autoClose: 1000});
    } else {
      toast('با خطا مواجه شد', {type: 'error', autoClose: 1000});
    }
  };
  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <div className="flex w-4/5 flex-grow flex-col gap-y-8">
        {/* --- */}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Escalate Alarm</h4>
          <div className="flex items-center gap-x-2">
            <span>
              <input
                onChange={() =>
                  dispatch(setSelectedautomaticevent('severity_at_least'))
                }
                type="checkbox"
              />
            </span>

            <span className="mr-4">
              Escalate Alarms Only If Alarm Severity Is At Least
            </span>

            <Select
              disabled={
                selectedautomaticevents.findIndex(
                  data => data == 'severity_at_least',
                ) > -1
                  ? false
                  : true
              }
              onChange={e => {
                let alarmlistCopy = deepcopy(alarmtypedetail);
                alarmlistCopy.automatic_events.escalate_alarm.severity_at_least =
                  e.target.value;
                dispatch(setalarmsdetail(alarmlistCopy));
              }}>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-x-8">
            <span className="w-16 text-center">Days</span>
            <span className="w-16 text-center">Hours</span>
            <span className="w-16 text-center">Minutes</span>
          </div>

          <ScheduleSelector
            className="w-full"
            parentName="escalate_alarm"
            name="escalate_pending_after"
            label="Escalate Pending Alarms after"
          />
          <ScheduleSelector
            parentName="escalate_alarm"
            name="escalate_acknowledged_after"
            label="Escalate Acknowledged Alarms after"
          />
        </div>

        {/* ---*/}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Time Out Alarm</h4>
          <ScheduleSelector
            parentName="timeout_alarm"
            name="timeout_pending_after"
            label="Time Out Pending Alarms after"
          />
          <ScheduleSelector
            parentName="timeout_alarm"
            name="timeout_acknowledged_after"
            label="Time Out Acknowlegdged Alarms after"
          />
        </div>

        {/* --- */}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Delete Alarm</h4>
          <ScheduleSelector
            parentName="delete_alarm"
            name="delete_resolved_after"
            label="Delete Resolved Alarms after"
          />
          <ScheduleSelector
            parentName="delete_alarm"
            name="delete_in_progress_after"
            label="Delete In Progress Alarms after"
          />
          <ScheduleSelector
            parentName="delete_alarm"
            name="delete_timeout_after"
            label="Delete Timed Out Alarms after"
          />
          {/* <ScheduleSelector label="Delete Obsolete Alarms after" /> */}
        </div>
      </div>

      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={updateevents} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeEventPage;
