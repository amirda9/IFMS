import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {SimpleBtn, TextInput} from '~/components';
import {RootState} from '~/store';
import AppDialog from '~/components/modals/AppDialog';
import {
  changealarmstatus,
  changestate,
  setAllalarmdata,
} from '~/store/slices/alarmsslice';
import Selectbox from '~/components/selectbox/selectbox';
import {$Get, $PUT, $Post, $Put} from '~/util/requestapi';
import {toast} from 'react-toastify';
import {getPrettyDateTime} from '~/util/time';
const AlarmRow = ({
  title,
  data,
  onchange = () => {},
}: {
  title: string;
  data: string;
  onchange?: () => void;
}) => {
  return (
    <div className="mt-8 flex flex-row items-center justify-between">
      <span className="text-[20px]  font-normal leading-[24.2px]">{title}</span>
      <TextInput
        onChange={onchange}
        value={data}
        className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
      />
    </div>
  );
};

const options = [
  {value: 'Pending', label: 'Pending'},
  {value: 'Acknowledged', label: 'Acknowledged'},
  {value: 'In progress', label: 'In progress'},
  {value: 'Resolved', label: 'Resolved'},
];
function AlarmAlarmsPage() {
  const {allalarmdata, alarmstatus} = useSelector(
    (state: RootState) => state.alarmsslice,
  );
  const [showmodal,setShowmodal]=useState(false)
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [updateloading, setUpdateloading] = useState(false);
  const location = useLocation();
  const idLisString = location.state?.id_list!;
  const idLisArray = idLisString;
  const [allupdateallarms, setAllupdateallarms] = useState<
    {
      alarm_id: string;
      new_status: string;
    }[]
  >([]);

  const geralarmsdetail = async () => {
    try {
      setLoading(true);
      const response = await $Post(`otdr/alarm/events/details`, idLisArray);
      console.log('response', response);
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
  useEffect(() => {
    if (!alarmstatus) {
      geralarmsdetail();
    }
  }, []);



  const updatealarms = async () => {
    try {
      setUpdateloading(true);
      const response = await $Put(
        `otdr/alarm/events/update_status/`,
        allupdateallarms,
      );
      if (response?.status == 201) {
        // geralarmsdetail()
        dispatch(changealarmstatus(true));
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`update error is:${error}`);
    } finally {
      setUpdateloading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="w-full px-2 pb-8 pt-4">
      {allalarmdata?.alarms &&
        allalarmdata?.alarms.map(data => {
          let checkescalation =
            data?.to_escalation?.days == 0 &&
            data?.to_escalation?.minutes == 0 &&
            data?.to_escalation?.hours == 0
              ? false
              : true;
          let checketimeout =
            data?.to_time_out?.days == 0 &&
            data?.to_time_out?.minutes == 0 &&
            data?.to_time_out?.hours == 0
              ? false
              : true;

          return (
            <div
              className={`mt-4 flex w-full flex-row justify-between  rounded-[10px] ${
                !checketimeout
                  ? 'bg-[#F48F8F]'
                  : !checkescalation
                  ? 'bg-[#FCC483]'
                  : 'bg-[#C0E7F2]'
              }  p-8 pb-4 pt-[0px]`}>
                {showmodal?
                <AppDialog
               closefunc={()=>setShowmodal(false)}
              >
                
                <div className="ml-[80px]  w-[calc(100%-80px)]">
                  <div className="mt-8 flex w-full flex-row justify-between">
                    <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
                      Parameter
                    </div>
                    <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
                      Value
                    </div>
                  </div>

                  {data.contributing_conditions.map(data => (
                    <>
                      {data.coef ? (
                        <div className="mt-8 flex w-full flex-row items-center justify-between">
                          <TextInput
                            onChange={() => {}}
                            value={data.parameter}
                            className="h-[40px] w-[40%]"
                          />
                          <div className="flex w-[50%] flex-row justify-between">
                            <TextInput
                              onChange={() => {}}
                              value={data.coef}
                              className="h-[40px] w-[20%]"
                            />
                            <span className="mt-2">x</span>

                            <TextInput
                              onChange={() => {}}
                              value={data.value}
                              className="h-[40px] w-[70%]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 flex w-full flex-row justify-between">
                          <TextInput
                            onChange={() => {}}
                            value={data.parameter}
                            className="h-[40px] w-[40%]"
                          />
                          <TextInput
                            onChange={() => {}}
                            value={data.value}
                            className="h-[40px] w-[50%]"
                          />
                        </div>
                      )}
                    </>
                  ))}
                </div>
              </AppDialog>
              :
              null
              }
            
              <div className="w-[46%]">
                <AlarmRow
                  title="Secondary Source"
                  data={data.secondary_source}
                />
                {/* <div className="mt-8 w-full text-center text-[20px] font-normal leading-[24.2px]">
                  Alarm Detail
                </div> */}

                <AlarmRow title="Network" data={''} />
                <AlarmRow title="Station" data={data.station_name} />
                <AlarmRow
                  title="Last Modified"
                  data={getPrettyDateTime(data?.time_modified) || ''}
                />
                <AlarmRow
                  title="To Escalation"
                  data={`${data?.to_escalation?.days || 0} Day - ${
                    data?.to_escalation?.hours || 0
                  } Hours - ${data?.to_escalation?.minutes || 0} Minutes`}
                />

                {/* <AlarmRow title="Region Admin" data={data.region_admin} />

                <AlarmRow
                  title="Time Created"
                  data={getPrettyDateTime(data?.time_created) || ''}
                />

                <AlarmRow title="Severity" data={`${data?.severity}` || ''} />

                <AlarmRow
                  title="To Time Out"
                  data={`${data?.to_escalation?.days || 0} Day - ${
                    data?.to_escalation?.hours || 0
                  } Hours - ${data?.to_escalation?.minutes || 0} Minutes`}
                /> */}
              </div>

              <div className="flex w-[46%]  flex-col">
                <div className="mt-8 flex flex-row items-center justify-between">
                  <span className="text-[20px]  font-normal leading-[24.2px]">
                    State
                  </span>
                  <Selectbox
                    defaultvalue={data.status}
                    onclickItem={(e: {value: string; label: string}) => {
                      setAllupdateallarms(prev => [
                        ...prev,
                        {alarm_id: data.id, new_status: e.value},
                      ]);
                      dispatch(changestate({id: data.id, value: e.value}));
                      dispatch(changealarmstatus(false));
                    }}
                    options={options}
                    classname={
                      'h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white'
                    }
                  />
                  {/* <TextInput
                    onChange={e => changestate(data.id, e.target.value)}
                    defaultValue={data.status}
                    className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
                  /> */}
                </div>
                <AlarmRow title="Region" data={data?.region_name} />
                <AlarmRow title="Region Admin" data={data.region_admin} />
                <AlarmRow
                  title="Alarm Time"
                  data={getPrettyDateTime(data?.time_created) || ''}
                />
                <AlarmRow
                  title="To Time Out"
                  data={`${data?.to_escalation?.days || 0} Day - ${
                    data?.to_escalation?.hours || 0
                  } Hours - ${data?.to_escalation?.minutes || 0} Minutes`}
                />
                <SimpleBtn onClick={()=> setShowmodal(true)} className="ml-[calc(100%-130px)] mt-4">
                  Parameters
                </SimpleBtn>
                {/* <div className="ml-[80px]  w-[calc(100%-80px)]">
                  <div className="mt-8 flex w-full flex-row justify-between">
                    <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
                      Parameter
                    </div>
                    <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
                      Value
                    </div>
                  </div>

                  {data.contributing_conditions.map(data => (
                    <>
                      {data.coef ? (
                        <div className="mt-8 flex w-full flex-row items-center justify-between">
                          <TextInput
                            onChange={() => {}}
                            value={data.parameter}
                            className="h-[40px] w-[40%]"
                          />
                          <div className="flex w-[50%] flex-row justify-between">
                            <TextInput
                              onChange={() => {}}
                              value={data.coef}
                              className="h-[40px] w-[20%]"
                            />
                            <span className="mt-2">x</span>

                            <TextInput
                              onChange={() => {}}
                              value={data.value}
                              className="h-[40px] w-[70%]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-8 flex w-full flex-row justify-between">
                          <TextInput
                            onChange={() => {}}
                            value={data.parameter}
                            className="h-[40px] w-[40%]"
                          />
                          <TextInput
                            onChange={() => {}}
                            value={data.value}
                            className="h-[40px] w-[50%]"
                          />
                        </div>
                      )}
                    </>
                  ))}
                </div> */}
              </div>
            </div>
          );
        })}

      <div className="mt-8 flex flex-row justify-end gap-x-4">
        <SimpleBtn loading={updateloading} onClick={updatealarms} type="submit">
          Save
        </SimpleBtn>

        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
}

export default AlarmAlarmsPage;
