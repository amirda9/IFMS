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
  <div className='flex flex-row justify-between items-center mb-[20px] w-full'>
  <span className='text-[20px] w-[197px] text-[#000000] font-light leading-[24.2px]'>
 {name}
  </span>
  <span className='text-[20px] w-[190px] text-[#000000] font-light leading-[24.2px]'>
  {value}
  </span>
 </div>
 )
}
function Opticalroute({onclick}:Iprops) {
  return (
   <div className="h-full w-full bg-[#C6DFF8] p-[10px] box-border rounded-[10px]">
   <Selectbox
   defaultvalue='Optical Route'
     onclickItem={(e: {value: string; label: string}) => onclick(e.label)}
     options={options}
     borderColor={'black'}
     classname={'w-full h-[40px] rounded-[10px] mb-[25px]'}
   />
  <Resultdata name={'Optical Route name'} value={'Route 1'}  />
  <Resultdata name={'Source Station'} value={'Station 1'}  />
  <Resultdata name={'Destination Station'} value={'Station 2'}  />
  <Resultdata name={'RTU Name'} value={'RTU 1'}  />
  <Resultdata name={'Average Helix Factor'} value={'1%'}  />
  <Resultdata name={'Wavelength'} value={'1550 nm'}  />
  <Resultdata name={'IOR'} value={'1.465'}  />
  <Resultdata name={'RBS'} value={'-45.01 dB'}  />
 </div>
  )
}

export default Opticalroute