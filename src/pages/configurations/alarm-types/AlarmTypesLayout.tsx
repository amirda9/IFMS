import {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import {RootState} from '~/store';
import {$Delete, $Get} from '~/util/requestapi';
import Swal from 'sweetalert2';
import {alarmtypedetailtype} from '~/types/alarmtypes';
import {
  setAlarmtypeloading,
  setGetalarmtype,
  setalarmlist,
  setalarmsdetail,
  deletealarmtype
} from '~/store/slices/alarmstypeslice';
import { toast } from 'react-toastify';
import { deepcopy } from '~/util/deepcopy';
const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};
const AlarmTypesLayout: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const {alarmtypelist,getalarmtype} = useSelector((state: RootState) => state.alarmtypes);

  useEffect(() => {
    if (!getalarmtype && params.alarmId) {
      const getalarmdetail = async () => {
        try {
          dispatch(setAlarmtypeloading(true));
          const alarmdetailresponse = await $Get(
            `otdr/alarm/${params.alarmId}`,
          );
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
              console.log("alarmdeyyyyyyyyyyyyyy",alarmdetailresponsedata.alarm_definition);
              // Here we need to add index to the objects so that when we click the Add button on the front side or delete a row, the rows are arranged in order.
           if(alarmdetailresponsedataCopy.alarm_definition.low_severity){
            alarmdetailresponsedataCopy.alarm_definition.low_severity!.conditions =
            Array.isArray(alarmdetailresponsedata.alarm_definition?.low_severity?.conditions) && alarmdetailresponsedata.alarm_definition?.low_severity?.conditions?.map(
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
               Array.isArray(alarmdetailresponsedata.alarm_definition?.medium_severity?.conditions) &&  alarmdetailresponsedata.alarm_definition?.medium_severity?.conditions?.map(
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
             Array.isArray(alarmdetailresponsedata?.alarm_definition?.high_severity!.conditions) &&  alarmdetailresponsedata?.alarm_definition?.high_severity!.conditions?.map(
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
            if (alarmdetailresponsedataCopy?.alert_sending == null) {
              alarmdetailresponsedataCopy = {
                ...alarmdetailresponsedataCopy,
                alert_sending: {
                  about: 'Pending',
                  user: [],
                },
              };
            }

            if (alarmdetailresponsedataCopy?.automatic_events == null) {
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
          } else {
            toast('Encountered an error', {type: 'error', autoClose: 1000});
          }
        } catch (error) {
          console.log(`getalarmtypeDetailError is:${error}`);
          // toast('Encountered an error', {type: 'error', autoClose: 1000});
        } finally {
          dispatch(setAlarmtypeloading(false));
        }
      };
      getalarmdetail();
    }
  }, [params.alarmId]);


  useEffect(() => {
    const getalarmms = async () => {
      const getalarmsresponse = await $Get(`otdr/alarm`);
      if (getalarmsresponse?.status == 200) {
        const responsedata = await getalarmsresponse?.json();
        dispatch(setalarmlist(responsedata));
      }
    };
    getalarmms();
  }, []);

  const Deletealarms = async (id: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        const deletealarmsresponse = await $Delete(`otdr/alarm/${id}`);
        if (deletealarmsresponse?.status == 200) {
          dispatch(deletealarmtype(id));
          navigate('./');
        }
      }
    });
  };


  
  return (
    <SidebarLayout createTitle="Alarm Types Definition" canAdd>
      {alarmtypelist.map((data: any) => (
        <SidebarItem
        onclick={()=> dispatch(setGetalarmtype(false))}
          selected={true}
          canDelete={true}
          onDelete={() => Deletealarms(data.id)}
          name={data.name}
          to={data.id}
        />
      ))}
    </SidebarLayout>
  );
};

export default AlarmTypesLayout;
