import {FC, useRef, useState} from 'react';
import {Description, Select, TextInput} from '~/components';
import dateicon from '~/assets/images/dateicon.png'
import './index.css'
import { useSelector } from 'react-redux';
const TestDetailsLearning: FC = () => {
  const {opticalrouteTestSetupDetail} = useSelector((state: any) => state.http);
  const {opticalroutUpdateTestsetupDetail} = useSelector((state: any) => state.opticalroute);

  const [selectedradio,setSelectedradio]=useState("On")
  const [selectedradio2,setSelectedradio2]=useState("On")
  const firstdateref:any=useRef(null)
  const secenddateref:any=useRef(null)
  function RadioButton({name}: any) {
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
  function RadioButton2({name}: any) {
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
  console.log(opticalrouteTestSetupDetail,'rrrrrr');
  console.log(opticalroutUpdateTestsetupDetail,'opticalroutUpdateTestsetupDetail🤓');
  
  return (
    <div className="flex flex-col gap-y-8">
    
      <Description labelClassName='basis-64' label="Targeted Count Per Cycle">
        <TextInput name="count-per-cycle" type="number" />
      </Description>

      <Description labelClassName='basis-64' label="Start a New Cycle">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center">
          <RadioButton  name="On"/>
            <input ref={firstdateref} type="date" className="h-8 rounded-md border border-black px-2 w-48 ml-6" />
            <img src={dateicon}  onClick={()=> firstdateref.current.showPicker()} className='w-[35px] h-[35px] ml-[5px]'   />
          </div>
          <div className="flex flex-row items-center gap-x-4">
          <RadioButton  name="Every"/>
            <TextInput defaultValue={2} className="w-16" />
            <Select className='w-26' >
              <option>Months</option>
              <option>Days</option>
            </Select>
          </div>
        </div>
      </Description>

      <Description labelClassName='basis-64' label={<span className='flex items-center gap-x-2'><span>Increase Target by</span> <TextInput className='w-16' /></span>}>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center">
          <RadioButton2  name="On"/>
        
          <input ref={secenddateref} type="date" className="h-8 rounded-md border border-black px-2 w-48 ml-6" />
            <img src={dateicon}  onClick={()=> secenddateref.current.showPicker()} className='w-[35px] h-[35px] ml-[5px]'   />
          </div>
          <div className="flex flex-row items-center gap-x-4">
          <RadioButton2  name="Every"/>

            <TextInput defaultValue={2} className="w-16" />
            <Select className='w-26' >
              <option>Months</option>
              <option>Days</option>
            </Select>
            <span>Up to Max.</span>
            <TextInput className='w-16' />
            <span>traces</span>
          </div>
        </div>
      </Description>
    </div>
  );
};

export default TestDetailsLearning;
