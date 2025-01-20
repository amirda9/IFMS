import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {SimpleBtn, TextInput} from '~/components';
import {RootState} from '~/store';
import yellowicon from '~/assets/icons/noYellow.png';
import redicon from '~/assets/icons/noRed.png';
import orangeicon from '~/assets/icons/noOrange.png';
import AppDialog from '~/components/modals/AppDialog';
import {
  changealarmstatus,
  changestate,
  setAllalarmdata,
} from '~/store/slices/alarmsslice';
import Selectbox from '~/components/selectbox/selectbox';
import {$Post, $Put} from '~/util/requestapi';
import {toast} from 'react-toastify';
import {getPrettyDateTime} from '~/util/time';
// *************** types *************** types ******************** types ******

type modalvalue = {
  contributing_conditions: {
    coef: number;
    parameter: string;
    value: string;
    reference_value: number;
    measured_value: number;
  }[];

  id: string;

  region_admin: string;

  region_name: string;

  secondary_source: string;

  severity: string;

  station_name: string;

  status: string;

  time_created: string;

  time_modified: string;

  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
};

// *************** types *************** types ******************** types ******
const AlarmRow = ({
  title,
  data,
  onchange = () => {},
}: {
  title: string;
  data: string | number;
  onchange?: () => void;
}) => {
  return (
    <div className="mt-6 flex flex-row items-center justify-between">
      <span className="text-[20px]  font-normal leading-[24.2px]">{title}</span>
      <TextInput
        type={'text' || 'number'}
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
  const [modaldata, setModaldata] = useState<modalvalue | null>(null);
  const [showmodal, setShowmodal] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [updateloading, setUpdateloading] = useState(false);
  const location = useLocation();
  const idLisArray = location.state?.id_list!;
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

  useEffect(() => {
    if (modaldata) {
      setShowmodal(true);
    }
  }, [modaldata]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  console.log("allalarmdata",allalarmdata);
  
  return (
    <>
      {showmodal && modaldata ? (
        <AppDialog
          closefunc={() => {
            setModaldata(null), setShowmodal(false);
          }}>
          <div className="ml-[80px]  w-[calc(100%-80px)]">
            <div className="mt-8 flex w-full flex-row justify-between">
              <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
                Parameter
              </div>
              <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
                Value
              </div>
            </div>

            {modaldata?.contributing_conditions?.map((contributingdata,index) => (
              <div className='w-full' key={index}>
                {contributingdata.coef ? (
                  <div className="mt-8 flex w-full flex-row items-center justify-between">
                    <TextInput
                      onChange={() => {}}
                      value={`${contributingdata.parameter}: ${contributingdata.measured_value} km`}
                      className="h-[40px] w-[40%]"
                    />
                    <div className="flex w-[50%] flex-row justify-between">
                      <TextInput
                        type="text"
                        onChange={() => {}}
                        value={contributingdata.coef}
                        className="h-[40px] w-[20%]"
                      />
                      <span className="mt-2">x</span>

                      <TextInput
                        type="text"
                        onChange={() => {}}
                        value={`${contributingdata.value}: ${contributingdata.reference_value} km`}
                        className="h-[40px] w-[70%]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 flex w-full flex-row justify-between">
                    <TextInput
                      type="text"
                      onChange={() => {}}
                      value={contributingdata.parameter}
                      className="h-[40px] w-[40%]"
                    />
                    <TextInput
                      type="text"
                      onChange={() => {}}
                      value={contributingdata.value}
                      className="h-[40px] w-[50%]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </AppDialog>
      ) : null}

      <div className="mt-4 box-border flex w-full flex-col px-2  pb-8">
        {allalarmdata?.alarms &&
          allalarmdata?.alarms.map((data,index) => {
            let checkescalation =
              data?.to_escalation?.days == 0 &&
              data?.to_escalation?.minutes == 0 &&
              data?.to_escalation?.hours == 0
                ? false
                : true;
            let checketimeout =
              data?.to_timeout?.days == 0 &&
              data?.to_timeout?.minutes == 0 &&
              data?.to_timeout?.hours == 0
                ? false
                : true;

            return (
           
                <div
                key={index}
                  className={`mt-4   rounded-[10px] ${
                    !checketimeout
                      ? 'bg-[#F48F8F]'
                      : !checkescalation
                      ? 'bg-[#FCC483]'
                      : 'bg-[#C0E7F2]'
                  }  p-8 pb-4 pt-[0px]`}>
                  <div className="mt-4 flex w-full flex-row  justify-between items-center">
                    <div className="flex h-10 w-[100px] flex-row">
                      <span className='text-[20px]'>{index+1}</span>
                      <img src={data.severity == "Medium"?orangeicon:data.severity == "High"?yellowicon:""} className="h-[35px] w-[35px] ml-10" />
                    </div>
                    <div className="flex flex-row-reverse">
                      <SimpleBtn
                        onClick={() => {
                          setModaldata(data);
                        }}
                        className="">
                        Parameters
                      </SimpleBtn>
                      <SimpleBtn
                        onClick={() => {
                        
                        }}
                        className="mx-2">
                        OTDR Trace
                      </SimpleBtn>
                      <SimpleBtn
                        onClick={() => {
             
                        }}
                        className="">
                        Map View
                      </SimpleBtn>
                    </div>
                  </div>
                  <div className="flex w-full flex-row justify-between">
                    <div className="w-[46%]">
                      <AlarmRow
                        title="Alarm Type"
                        data={data.secondary_source}
                      />
                      <AlarmRow
                        title="Network"
                        data={allalarmdata?.details?.network_name}
                      />
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
                            dispatch(
                              changestate({id: data.id, value: e.value}),
                            );
                            dispatch(changealarmstatus(false));
                          }}
                          options={options}
                          classname={
                            'h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white'
                          }
                        />
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
                    </div>
                  </div>
                </div>
            
            );
          })}

        <div className="mt-8 flex flex-row justify-end gap-x-4">
          <SimpleBtn
            loading={updateloading}
            onClick={updatealarms}
            type="submit">
            Save
          </SimpleBtn>

          <SimpleBtn link to="../">
            Cancel
          </SimpleBtn>
        </div>
      </div>
    </>
  );
}

export default AlarmAlarmsPage;
