import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import {RootState} from '~/store';
import {
  alarmtypedetailtype,
  setAlarmtypeloading,
  setGetalarmtype,
  setalarmlist,
  setalarmsdetail,
} from '~/store/slices/alarmstypeslice';
import {deepcopy} from '~/util';
import {$Get, $Put} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';

type FormType = {
  name: string;
  comment: string;
  sourceDataSet: string;
};

const AlarmTypeDetailsPage: FC = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {alarmtypedetail, alarmtypelist, alarmtypeloading, getalarmtype} =
    useSelector((state: RootState) => state.alarmtypes);

  useEffect(() => {
    if (!getalarmtype) {
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

            console.log("alarmdetailresponsedataalarmdetailresponsedata",alarmdetailresponsedata);
            
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
          } else {
            toast('Encountered an error', {type: 'error', autoClose: 1000});
          }
        } catch (error) {
          console.log(`getalarmtypeDetailError is:${error}`);
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        } finally {
          dispatch(setAlarmtypeloading(false));
        }
      };
      getalarmdetail();
    }
  }, [params.alarmId]);

  const formik = useFormik<FormType>({
    enableReinitialize: true,
    initialValues: {
      name: alarmtypedetail.name,
      comment: alarmtypedetail.comment,
      sourceDataSet: 'Fiber Result',
    },
    onSubmit: async values => {
      try {
        const updatealarmtypedetail = await $Put(
          `otdr/alarm/${params!.alarmId!}`,
          {name: values.name, comment: values.comment},
        );
        if (updatealarmtypedetail?.status == 201) {
          const alarmtypelistCopy = deepcopy(alarmtypelist);
          const findalarmindex = alarmtypelist.findIndex(
            data => data.id == params!.alarmId!,
          );
          alarmtypelistCopy[findalarmindex].name = values.name;
          alarmtypelistCopy[findalarmindex].comment = values.comment;
          dispatch(setalarmlist(alarmtypelistCopy));
          toast('It was done successfully', {type: 'success', autoClose: 1000});
        } else {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    },
  });

  if (alarmtypeloading) {
    return <h1>Loaing...</h1>;
  }
  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" className="flex-grow">
              <InputFormik name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" labelClassName="mt-[-30px]">
              <TextareaFormik name="comment" />
            </Description>

            <Description label="Owner" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                {alarmtypedetail.owner_username}
              </span>
            </Description>
            <Description label="Created" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                {getPrettyDateTime(alarmtypedetail.time_created)}
              </span>
            </Description>
            <Description label="Last Modified" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                {getPrettyDateTime(alarmtypedetail.time_modified)}
              </span>
            </Description>
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default AlarmTypeDetailsPage;
