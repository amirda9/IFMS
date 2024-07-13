import {FC, useEffect} from 'react';
import {Select, SimpleBtn} from '~/components';
import AlarmCheckboxList from './AlarmCheckboxList';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
import {
  alarmtypedetailtype,
  setAlarmtypeloading,
  setGetalarmtype,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {$Get, $Put} from '~/util/requestapi';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';

const item = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Admin',
      },
      {
        label: 'Network Admin',
      },
      {
        label: 'Network Viewer',
      },
      {
        label: 'Region Admin',
      },
      {
        label: 'Region Viewer',
      },
      {
        label: 'Station Admin',
      },
      {
        label: 'Station Viewer',
      },
    ],
  },
];

const aboutoptions = [
  {label: 'Pending'},
  {label: 'Acknowledged'},
  {label: 'In progress'},
  {label: 'Resolved'},
];

const AlarmTypeAlertPage: FC = () => {
  const params = useParams();
  const {alarmtypedetail, alarmtypeloading, getalarmtype} = useSelector(
    (state: RootState) => state.alarmtypes,
  );
  const dispatch = useDispatch();
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

  const updatedefinition = async () => {
    try {
      dispatch(setAlarmtypeloading(true));
      const response = await $Put(`otdr/alarm/${params.alarmId}`, {
        alert_sending: alarmtypedetail.alert_sending,
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
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex flex-grow flex-col gap-y-8">
        <Select
          onChange={e => {
            const alarmtypedetailCopy = deepcopy(alarmtypedetail);
            alarmtypedetailCopy.alert_sending.about = e.target.value;
            dispatch(setalarmsdetail(alarmtypedetailCopy));
          }}
          className="w-1/4 disabled:text-gray-400 disabled:opacity-100">
          {aboutoptions.map(data => (
            <option>{data.label}</option>
          ))}
        </Select>

        <div className="w-1/4">
          <AlarmCheckboxList type="sending" items={item} />
        </div>
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={updatedefinition} type="button">
          Save
        </SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeAlertPage;
