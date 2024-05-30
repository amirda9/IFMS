import {SimpleBtn, Table} from '~/components';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '~/store';
import {$Get, $Put} from '~/util/requestapi';
import {deepcopy} from '~/util';
import {
  alarmtypedetailtype,
  setAlarmtypeloading,
  setGetalarmtype,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {toast} from 'react-toastify';
import {useEffect, useState} from 'react';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Network', size: 'w-[90%]', sort: true},
};

const Alarmtypenetworks = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {alarmtypedetail, getalarmtype, alarmtypeloading} = useSelector(
    (state: RootState) => state.alarmtypes,
  );
  const [loading, setLoading] = useState(false);

  const getalarmdetail = async () => {
    try {
      dispatch(setAlarmtypeloading(true));
      const alarmdetailresponse = await $Get(`otdr/alarm/${params.alarmId}`);

      if (alarmdetailresponse.status == 200) {
        const alarmdetailresponsedata = await alarmdetailresponse.json();
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

  const cancel = async () => {
    const alarmtypedetailCopy = deepcopy(alarmtypedetail);
    const alarmdetailresponse = await $Get(`otdr/alarm/${params.alarmId}`);
    if (alarmdetailresponse.status == 200) {
      const alarmdetailresponsedata = await alarmdetailresponse.json();
      if (alarmdetailresponsedata.alarm_networks == null) {
        alarmtypedetailCopy.alarm_networks = {network_id_list: []};
      } else {
        alarmtypedetailCopy.alarm_networks.network_id_list =
          alarmdetailresponsedata.alarm_networks.network_id_list;
      }
      dispatch(setalarmsdetail(alarmtypedetailCopy));
    }
  };

  const updatealarmtypenetworks = async () => {
    try {
      dispatch(setAlarmtypeloading(true));
      const response = await $Put(`otdr/alarm/${params.alarmId}`, {
        alarm_networks: {
          network_id_list: alarmtypedetail.alarm_networks.network_id_list.map(
            data => data.id,
          ),
        },
      });
      if (response.status == 201) {
        const alarmdetailresponse = await $Get(`otdr/alarm/${params.alarmId}`);
        if (alarmdetailresponse.status == 200) {
          const alarmdetailresponsedata = await alarmdetailresponse.json();
          dispatch(setalarmsdetail(alarmdetailresponsedata));
          toast('It was done successfully', {type: 'success', autoClose: 1000});
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      }
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    } finally {
      dispatch(setAlarmtypeloading(false));
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          onclicktitle={(tabname: string, sortalfabet: boolean) => {}}
          cols={columns}
          items={alarmtypedetail.alarm_networks.network_id_list}
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index + 1}
          containerClassName="w-1/2"
          loading={alarmtypeloading}
        />
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="../edit-alert-networks">
          Edit Networks
        </SimpleBtn>

        <SimpleBtn onClick={() => updatealarmtypenetworks()}>Save</SimpleBtn>

        <SimpleBtn type="button" onClick={() => cancel()}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default Alarmtypenetworks;
