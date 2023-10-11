import React from 'react'
import Selectbox from '~/components/selectbox/selectbox';
type Resultdata={
 name:string,
 value:string
}
type Iprops={
 onclick:(name:string)=>void
}
const options = [
  {value: 'Result', label: 'Result'},
  {value: 'Optical Route', label: 'Optical Route'},
  {value: 'Alarms', label: 'Alarms'},
];

const Resultdata=({name,value}:Resultdata)=>{
 return(
  <div className='flex flex-row justify-between items-center mb-[20px] w-[400px]'>
  <span className='text-[20px] w-[197px] text-[#000000] font-light leading-[24.2px]'>
 {name}
  </span>
  <span className='text-[20px] w-[190px] text-[#000000] font-light leading-[24.2px]'>
  {value}
  </span>
 </div>
 )
}
function Alarms({onclick}:Iprops) {
  return (
   <div className="h-full overflow-y-auto overflow-x-hidden w-full bg-[#C6DFF8] p-[10px] box-border rounded-[10px]">
   <Selectbox
   defaultvalue='Alarms'
     onclickItem={(e: {value: string; label: string}) => onclick(e.label)}
     options={options}
     borderColor={'black'}
     classname={'w-full h-[40px] rounded-[10px] mb-[25px]'}
   />
  <Resultdata name={'# High Severity'} value={'1'}  />
  <Resultdata name={'# Medium Severity'} value={'2'}  />
  <Resultdata name={'# Low Severity'} value={'3'}  />
  <div className='w-full border-t-[1px] border-[black] mb-[5px]'></div>
  <Resultdata name={'#1'} value={''}  />
  <Resultdata name={'Name'} value={'Alarm 1'}  />
  <Resultdata name={'Severity'} value={'Medium'}  />
  <Resultdata name={'Event Number'} value={'2'}  />
  <div className='w-full border-t-[1px] border-[black] mb-[5px]'></div>
  <Resultdata name={'#2'} value={''}  />
  <Resultdata name={'Name'} value={'Alarm 2'}  />
  <Resultdata name={'Severity'} value={'High'}  />
  <Resultdata name={'Event Number'} value={'3'}  />
 </div>
  )
}

export default Alarms