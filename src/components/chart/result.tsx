import React from 'react'
import Selectbox from '~/components/selectbox/selectbox';
type Resultdata={
 name:string,
 value:string
}

type Iprops={
  onclick:(name:string)=>void;
  Length:string;
  Loss:string;
  AverageLoss:string;
  NoiseFloor:string;
  ORL:string;
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
function Rightbar({onclick,Length,Loss,AverageLoss,NoiseFloor,ORL}:Iprops) {
  return (
   <div className="h-full w-full o bg-[#C6DFF8] p-[10px] box-border rounded-[10px]">
   <Selectbox
 onclickItem={(e: {value: string; label: string}) => onclick(e.label)}
     options={options}
     defaultvalue='Result'
     borderColor={'black'}
     classname={'w-full h-[40px] rounded-[10px] mb-[25px]'}
   />
  <Resultdata name={'Date'} value={'2023/02/10'}  />
  <Resultdata name={'Length'} value={`${Length} km`}  />
  <Resultdata name={'Loss'} value={Loss}  />
  <Resultdata name={'Average Loss'} value={AverageLoss}  />
  <Resultdata name={'ORL'} value={ORL}  />
  <Resultdata name={'Average Splice Loss'} value={'0.285 dB'}  />
  <Resultdata name={'Max. Splice Loss'} value={'0.315 dB'}  />
  <Resultdata name={'Noise Floor'} value={NoiseFloor}  />
 </div>
  )
}

export default Rightbar