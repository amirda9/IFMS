import {FC, useEffect} from 'react';
import {Select, SimpleBtn} from '~/components';
import ScheduleSelector from './ScheduleSelector';
import {useDispatch, useSelector} from 'react-redux';
import {
  alarmtypedetailtype,
  changeallSelectedautomaticEvent,
  setAlarmtypeloading,
  setGetalarmtype,
  setSelectedautomaticEvent,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
import {$Get, $Put} from '~/util/requestapi';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

const AlarmTypeEventPage: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {
    alarmtypedetail,
    selectedautomaticevents,
    alarmtypeloading,
    getalarmtype,
  } = useSelector((state: RootState) => state.alarmtypes);

  const getalarmdetail = async () => {
    try {
      dispatch(setAlarmtypeloading(true));
      const alarmdetailresponse = await $Get(`otdr/alarm/${params.alarmId}`);

      if (alarmdetailresponse?.status == 200) {
        const alarmdetailresponsedata = await alarmdetailresponse?.json();
        let alarmdetailresponsedataCopy: alarmtypedetailtype = deepcopy(
          alarmdetailresponsedata,
        );
        if (alarmdetailresponsedataCopy.alarm_definition == null) {
          alarmdetailresponsedataCopy = {
            ...alarmdetailresponsedataCopy,
            alarm_definition: {
              low_severity: {
                conditions: [],
                fault: 'No',
              },
              medium_severity: {
                conditions: [],
                fault: 'No',
              },
              high_severity: {
                conditions: [],
                fault: 'No',
              },
            },
          };
        } else {
          // Here we need to add index to the objects so that when we click the Add button on the front side or delete a row, the rows are arranged in order.
          alarmdetailresponsedataCopy.alarm_definition.low_severity!.conditions =
            alarmdetailresponsedata.alarm_definition.low_severity!.conditions.map(
              (
                data: {
                  parameter: string;
                  operator: string;
                  coef: number;
                  value: string;
                  logical_operator: string;
                },
                index: number,
              ) => ({...data, index: index}),
            );

          alarmdetailresponsedataCopy.alarm_definition.medium_severity!.conditions =
            alarmdetailresponsedata.alarm_definition.medium_severity!.conditions.map(
              (
                data: {
                  parameter: string;
                  operator: string;
                  coef: number;
                  value: string;
                  logical_operator: string;
                },
                index: number,
              ) => ({...data, index: index}),
            );

          alarmdetailresponsedataCopy.alarm_definition.high_severity!.conditions =
            alarmdetailresponsedata.alarm_definition.high_severity!.conditions.map(
              (
                data: {
                  parameter: string;
                  operator: string;
                  coef: number;
                  value: string;
                  logical_operator: string;
                },
                index: number,
              ) => ({...data, index: index}),
            );
        }
        if (alarmdetailresponsedataCopy.alarm_content == null) {
          alarmdetailresponsedataCopy = {
            ...alarmdetailresponsedataCopy,
            alarm_content: {
              primary_source: '',
              secondary_source: '',
              alarm_details: {
                date_and_time: [],
                network: [],
                rtu: [],
                optical_route: [],
                test_setup: [],
                test_result: [],
              },
            },
          };
        }
        if (alarmdetailresponsedataCopy.alert_sending == null) {
          alarmdetailresponsedataCopy = {
            ...alarmdetailresponsedataCopy,
            alert_sending: {
              about: 'Pending',
              user: [],
            },
          };
        }

        if (alarmdetailresponsedataCopy.automatic_events == null) {
          alarmdetailresponsedataCopy = {
            ...alarmdetailresponsedataCopy,
            automatic_events: {
              escalate_alarm: {
                severity_at_least: '',
                escalate_pending_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
                escalate_acknowledged_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
              },
              timeout_alarm: {
                timeout_pending_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
                timeout_acknowledged_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
              },
              delete_alarm: {
                delete_resolved_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
                delete_in_progress_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
                delete_timeout_after: {
                  days: 0,
                  hours: 0,
                  minutes: 0,
                },
              },
            },
          };
        } else {
          if (
            alarmdetailresponsedataCopy.automatic_events.delete_alarm
              .delete_in_progress_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.delete_alarm.delete_in_progress_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }
          if (
            alarmdetailresponsedataCopy.automatic_events.delete_alarm
              .delete_resolved_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.delete_alarm.delete_resolved_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }
          if (
            alarmdetailresponsedataCopy.automatic_events.delete_alarm
              .delete_timeout_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.delete_alarm.delete_timeout_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }
          if (
            alarmdetailresponsedataCopy.automatic_events.escalate_alarm
              .escalate_acknowledged_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.escalate_alarm.escalate_acknowledged_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }
          if (
            alarmdetailresponsedataCopy.automatic_events.escalate_alarm
              .escalate_pending_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.escalate_alarm.escalate_pending_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }
          if (
            alarmdetailresponsedataCopy.automatic_events.escalate_alarm
              .severity_at_least == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.escalate_alarm.severity_at_least =
              '';
          }

          if (
            alarmdetailresponsedataCopy.automatic_events.timeout_alarm
              .timeout_acknowledged_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.timeout_alarm.timeout_acknowledged_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }

          if (
            alarmdetailresponsedataCopy.automatic_events.timeout_alarm
              .timeout_pending_after == null
          ) {
            alarmdetailresponsedataCopy.automatic_events.timeout_alarm.timeout_pending_after =
              {
                days: 0,
                hours: 0,
                minutes: 0,
              };
          }
        }

        if (alarmdetailresponsedataCopy.alarm_networks == null) {
          alarmdetailresponsedataCopy = {
            ...alarmdetailresponsedataCopy,
            alarm_networks: {
              network_id_list: [],
            },
          };
        }
        dispatch(setGetalarmtype(true));
        dispatch(setalarmsdetail(alarmdetailresponsedataCopy));
      }
    } catch (error) {
    } finally {
      dispatch(setAlarmtypeloading(false));
    }
  };

  useEffect(() => {
    if (!getalarmtype) {
      getalarmdetail();
    }
  }, []);

  useEffect(() => {
    const selectedautomaticeventsCopy = [];
    if (
      Number(
        alarmtypedetail.automatic_events.escalate_alarm
          .escalate_acknowledged_after.days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.escalate_alarm
          .escalate_acknowledged_after.hours,
      ) > 0 ||
      alarmtypedetail.automatic_events.escalate_alarm
        .escalate_acknowledged_after.minutes > 0
    ) {
      selectedautomaticeventsCopy.push('escalate_acknowledged_after');
    }
    if (
      Number(
        alarmtypedetail.automatic_events.escalate_alarm.escalate_pending_after
          .days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.escalate_alarm.escalate_pending_after
          .hours,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.escalate_alarm.escalate_pending_after
          .minutes,
      ) > 0
    ) {
      selectedautomaticeventsCopy.push('escalate_pending_after');
    }

    if (
      alarmtypedetail.automatic_events.escalate_alarm.severity_at_least != ''
    ) {
      selectedautomaticeventsCopy.push('severity_at_least');
    }

    if (
      Number(
        alarmtypedetail.automatic_events.timeout_alarm
          .timeout_acknowledged_after.days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.timeout_alarm
          .timeout_acknowledged_after.hours,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.timeout_alarm
          .timeout_acknowledged_after.minutes,
      ) > 0
    ) {
      selectedautomaticeventsCopy.push('timeout_acknowledged_after');
    }

    if (
      Number(
        alarmtypedetail.automatic_events.timeout_alarm.timeout_pending_after
          .days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.timeout_alarm.timeout_pending_after
          .hours,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.timeout_alarm.timeout_pending_after
          .minutes,
      ) > 0
    ) {
      selectedautomaticeventsCopy.push('timeout_pending_after');
    }
    if (
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_in_progress_after
          .days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_in_progress_after
          .hours,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_in_progress_after
          .minutes,
      ) > 0
    ) {
      selectedautomaticeventsCopy.push('delete_in_progress_after');
    }

    if (
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_resolved_after
          .days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_resolved_after
          .hours,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_resolved_after
          .minutes,
      ) > 0
    ) {
      selectedautomaticeventsCopy.push('delete_resolved_after');
    }

    if (
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_timeout_after.days,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_timeout_after
          .hours,
      ) > 0 ||
      Number(
        alarmtypedetail.automatic_events.delete_alarm.delete_timeout_after
          .minutes,
      ) > 0
    ) {
      selectedautomaticeventsCopy.push('delete_timeout_after');
    }
    dispatch(changeallSelectedautomaticEvent(selectedautomaticeventsCopy));
  }, []);

  const updateevents = async () => {
    try {
      dispatch(setAlarmtypeloading(true));
      const escalate_alarm = {
        ...(selectedautomaticevents.findIndex(
          data => data == 'severity_at_least',
        ) > -1 && {
          severity_at_least:
            alarmtypedetail.automatic_events.escalate_alarm.severity_at_least
              .length > 0
              ? alarmtypedetail.automatic_events.escalate_alarm
                  .severity_at_least
              : 'High',
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
            alarmtypedetail.automatic_events.timeout_alarm
              .timeout_pending_after,
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

      const response = await $Put(`otdr/alarm/${params.alarmId}`, {
        automatic_events: automatic_events,
      });
      if (response?.status == 201) {
        toast('It was done successfully', {type: 'success', autoClose: 1000});
      } else {
        getalarmdetail();
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    } finally {
      dispatch(setAlarmtypeloading(false));
    }
  };
  if (alarmtypeloading) {
    return <h1>Loading..</h1>;
  }
  return (
    <div className="flex flex-grow flex-col gap-y-8">
      <div className="flex w-4/5 flex-grow flex-col gap-y-8">
        {/* --- */}
        <div className="flex flex-col gap-y-3">
          <h4 className="font-semibold">Escalate Alarm</h4>
          <div className="flex items-center gap-x-2">
            <span>
              <input
                checked={
                  selectedautomaticevents.findIndex(
                    data => data == 'severity_at_least',
                  ) > -1
                    ? true
                    : false
                }
                onChange={() =>
                  dispatch(setSelectedautomaticEvent('severity_at_least'))
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
