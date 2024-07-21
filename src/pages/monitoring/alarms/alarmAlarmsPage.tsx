import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useSearchParams} from 'react-router-dom';
import {SimpleBtn, TextInput} from '~/components';
import {RootState} from '~/store';
import {
  changealarmstatus,
  changestate,
  setAllalarmdata,
} from '~/store/slices/alarmsslice';
import Selectbox from '~/components/selectbox/selectbox';
import {$Get, $PUT, $Post, $Put} from '~/util/requestapi';
import {toast} from 'react-toastify';
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
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchparams] = useSearchParams();
  const [updateloading,setUpdateloading]=useState(false)
  const idLisString = searchparams.get('id_lis');
  const idLisArray = idLisString && idLisString.split(',');
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

  // const changestate = (id: string, value: string) => {
  //   setAllupdateallarms(prev => [...prev, {alarm_id: id, new_status: value}]);
  // };

  const updatealarms = async () => {
    try {
      setUpdateloading(true)
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
    } finally{
      setUpdateloading(false)
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

 

  return (
    <div className="w-full px-6 pb-8 pt-4">
      {allalarmdata?.alarms &&
        allalarmdata?.alarms.map(data => (
          <div className="mt-4 flex w-full flex-row justify-between  rounded-[10px] bg-[#C0E7F2] p-8 pt-[0px]">
            <div className="w-[46%]">
              <AlarmRow title="Secondary Source" data={data.secondary_source} />
              <div className="mt-8 w-full text-center text-[20px] font-normal leading-[24.2px]">
                Alarm Detail
              </div>
              <AlarmRow title="Region Name" data={data.region_name} />
              <AlarmRow title="Region Admin" data={data.region_admin} />
              <AlarmRow title="Station Name" data={data.station_name} />
              <AlarmRow
                title="To Escalation"
                data={`${data?.to_escalation?.days || 0} Day - ${
                  data?.to_escalation?.hours || 0
                } Hours - ${data?.to_escalation?.minutes || 0} Minutes`}
              />
              <AlarmRow
                title="To Time Out"
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
                    dispatch(changestate({id: data.id, value: e.value}));
                    dispatch(changealarmstatus(false));
                  }}
                  options={options}
                  classname={
                    'h-[40px] w-[calc(100%-150px)] rounded-[10px] bg-white'
                  }
                />
                {/* <TextInput
                  onChange={e => changestate(data.id, e.target.value)}
                  defaultValue={data.status}
                  className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
                /> */}
              </div>
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
                          value={data.parameter}
                          className="h-[40px] w-[40%]"
                        />
                        <div className="flex w-[50%] flex-row justify-between">
                          <TextInput
                            value={data.coef}
                            className="h-[40px] w-[20%]"
                          />
                          <span className="mt-2">x</span>

                          <TextInput
                            value={data.value}
                            className="h-[40px] w-[70%]"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-8 flex w-full flex-row justify-between">
                        <TextInput
                          value={data.parameter}
                          className="h-[40px] w-[40%]"
                        />
                        <TextInput
                          value={data.value}
                          className="h-[40px] w-[50%]"
                        />
                      </div>
                    )}
                  </>
                ))}
              </div>
            </div>
          </div>
        ))}

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
