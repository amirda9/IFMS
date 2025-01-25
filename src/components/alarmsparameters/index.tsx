
import { useSelector } from 'react-redux';
import {TextInput} from '~/components';
import { RootState } from '~/store';
const valueunit:any={
    EventLocation:"Km",
    NumberofEvents:"",
    EventLoss:"dB",
    EventReflectance:"dB",
    OpticalRouteLength:"Km",
    SwitchStatus:""
   }



function Index() {
  const {alarmmodaldata} = useSelector(
    (state: RootState) => state.alarmsslice,
  );


  
  return (
    <div className="ml-[80px]  w-[calc(100%-80px)]">
    <div className="mt-8 flex w-full flex-row justify-between">
      <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
        Parameter
      </div>
      <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
        Value
      </div>
    </div>

    {alarmmodaldata?.contributing_conditions?.map((contributingdata,index) => (
      <div className='w-full' key={index}>
        {contributingdata.coef ? (
          <div className="mt-8 flex w-full flex-row items-center justify-between">
            <TextInput
              onChange={() => {}}
              value={`${contributingdata.parameter}: ${contributingdata.measured_value} ${valueunit[contributingdata.parameter.split(" ").join("")]}`}
              className="h-[40px] w-[40%]"
            />

            <span className='text-[20px]'>{contributingdata.operator}</span>
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
                value={`${contributingdata.value}: ${contributingdata.reference_value} ${valueunit[contributingdata.parameter.split(" ").join("")]}`}
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
            <span className='text-[20px]'>{contributingdata.operator}</span>
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
  )
}

export default Index