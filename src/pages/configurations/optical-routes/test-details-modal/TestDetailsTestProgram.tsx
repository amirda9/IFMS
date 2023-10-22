import {FC, useRef, useState} from 'react';
import {Description, TextInput} from '~/components';
import dateicon from '~/assets/images/dateicon.png'
const times = {
  Hourly: 'Hour(s)',
  Daily: 'Day(s)',
  Monthly: 'Month(s)',
  Yearly: 'Year(s)',
  Every: '',
};
 type RadioButton={
  name:string
 }
const TestDetailsTestProgram: FC = () => {
  const [selectedradio,setSelectedradio]=useState("On")
  const [selectedradio2,setSelectedradio2]=useState("Hourly")
  const firstdateref:any=useRef(null)
  const secenddateref:any=useRef(null)
  function RadioButton({name}: RadioButton) {
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => setSelectedradio(name)}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              selectedradio == name ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
        <span className="ml-[8px] text-[20px] font-light text-[#000000]">
          {name}
        </span>
      </div>
    );
  }
  function RadioButton2({name}: RadioButton) {
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => setSelectedradio2(name)}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              selectedradio2 == name ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
        <span className="ml-[8px] text-[20px] font-light text-[#000000]">
          {name}
        </span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-8">
      <Description label="Starting Date">
        <div className="flex items-center">
        <input ref={firstdateref} type="date" className="h-8 rounded-md border border-black px-2 w-48 ml-6" />
            <img src={dateicon}  onClick={()=> firstdateref.current.showPicker()} className='w-[35px] h-[35px] ml-[5px] mr-[25px]'   />
          <TextInput className='mr-[30px]' type="time" />
          <RadioButton  name="As Soon As Possible"/>
        </div>
      </Description>
      <Description label="End Date">
        <div className="flex items-center">
        <input ref={secenddateref} type="date" className="h-8 rounded-md border border-black px-2 w-48 ml-6" />
            <img src={dateicon}  onClick={()=> secenddateref.current.showPicker()} className='w-[35px] h-[35px] ml-[5px] mr-[25px]'   />
          <TextInput className='mr-[30px]' type="time" />
          <RadioButton  name="Indefinite"/>
        </div>
      </Description>
      <Description label="Periodicity">
        <div className="flex flex-col gap-y-4">
        <RadioButton2 name={'Hourly'} />
          <RadioButton2 name={'Daily'} />
          <RadioButton2 name={'Monthly'} />
          <RadioButton2 name={'Yearly'} />
          <RadioButton2 name={'Every'} />
        </div>
        <div className='ml-16'>
          <span>Every</span>
          <TextInput type="number" className='w-16 mx-4' />
          <span>Hour(s)</span>
        </div>
      </Description>
    </div>
  );
};

export default TestDetailsTestProgram;
