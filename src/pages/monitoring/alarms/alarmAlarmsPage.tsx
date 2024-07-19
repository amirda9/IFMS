import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {SimpleBtn, TextInput} from '~/components';
import { RootState } from '~/store';
import { setAllalarmdata } from '~/store/slices/alarmsslice';
import { $Post } from '~/util/requestapi';
const AlarmRow = ({
  title,
  data,
  onchange,
}: {
  title: string;
  data: string;
  onchange?: () => void;
}) => {
  return (
    <div className="mt-8 flex flex-row items-center justify-between">
      <span className="text-[20px]  font-normal leading-[24.2px]">{title}</span>
      <TextInput
        defaultValue={data}
        className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
      />
    </div>
  );
};
function AlarmAlarmsPage() {
  const {allalarmdata} = useSelector((state: RootState) => state.alarmsslice);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [searchparams] = useSearchParams();
  const idLisString = searchparams.get('id_lis');
  const idLisArray = idLisString && idLisString.split(',');


  useEffect(() => {
    if (!allalarmdata) {
      const geralarmsdetail = async () => {
        try {
          setLoading(true);
          const response = await $Post(`otdr/alarm/events/details`, idLisArray);

          if (response?.status == 200) {
            const responsedata = await response?.json();

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


  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="w-full px-6 pt-4 pb-8">

      {allalarmdata?.alarms && allalarmdata?.alarms.map((data)=>
            <div className="flex w-full flex-row justify-between rounded-[10px]  bg-[#C0E7F2] p-8 pt-[0px] mt-4">
            <div className="w-[46%]">
              <AlarmRow title="Secondary Source" data={data.secondary_source} />
              <div className="mt-8 w-full text-center text-[20px] font-normal leading-[24.2px]">
                Alarm Detail
              </div>
              <AlarmRow title="Region Name" data={data.region_name} />
              <AlarmRow title="Region Admin" data={data.region_admin} />
              <AlarmRow title="Station Name" data={data.station_name} />
              <AlarmRow title="To Escalation" data={`${data?.to_escalation?.days || 0} Day - ${data?.to_escalation?.hours || 0} Hours - ${data?.to_escalation?.minutes || 0} Minutes`} />
              <AlarmRow title="To Time Out" data={`${data?.to_escalation?.days || 0} Day - ${data?.to_escalation?.hours || 0} Hours - ${data?.to_escalation?.minutes || 0} Minutes`} />
            </div>
    
            <div className="flex w-[46%]  flex-col">
              <AlarmRow title="State" data={data.status} />
              <div className="ml-[80px]  w-[calc(100%-80px)]">
                <div className="mt-8 flex w-full flex-row justify-between">
                  <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
                    Parameter
                  </div>
                  <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
                    Value
                  </div>
                </div>
    
         
    
              {data.contributing_conditions.map((data)=>
              <>
              {data.coef?
               <div className="mt-8 flex w-full flex-row justify-between items-center">
               <TextInput value={data.parameter} className="h-[40px] w-[40%]" />
               <div className='w-[50%] flex flex-row justify-between'>
               <TextInput value={data.coef} className="h-[40px] w-[20%]" />
               <span className='mt-2'>x</span>
               
               <TextInput value={data.value} className="h-[40px] w-[70%]" />
               </div>
               
             </div>
              :
              <div className="mt-8 flex w-full flex-row justify-between">
              <TextInput value={data.parameter} className="h-[40px] w-[40%]" />
              <TextInput value={data.value} className="h-[40px] w-[50%]" />
            </div>
            }
              </>
              )}
               
              </div>
            </div>
          </div>
      )}


      <div className="flex flex-row gap-x-4 justify-end mt-8">
        <SimpleBtn type="submit">Save</SimpleBtn>

        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
}

export default AlarmAlarmsPage;
