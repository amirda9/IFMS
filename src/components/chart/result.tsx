import React from 'react'
import Selectbox from '~/components/selectbox/selectbox';
type Resultdata={
 name:string,
 value:string | number
}
6104338976908588
type Iprops={
  onclick:(name:string)=>void;
  Length:string;
  Loss:string;
  AverageLoss:string;
  NoiseFloor:string;
  ORL:string;
  Date:string;
  maxloss:number;
  AverageSplice:number
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
function Rightbar({onclick,Length,Loss,AverageLoss,NoiseFloor,ORL,Date,maxloss,AverageSplice}:Iprops) {
  return (
   <div className="h-full w-full o bg-[#C6DFF8] p-[10px] box-border rounded-[10px]">
   <Selectbox
 onclickItem={(e: {value: string; label: string}) => onclick(e.label)}
     options={options}
     defaultvalue='Result'
     borderColor={'black'}
     classname={'w-full h-[40px] rounded-[10px] mb-[25px]'}
   />
  <Resultdata name={'Date'} value={Date}  />
  <Resultdata name={'Length'} value={`${Length} km`}  />
  <Resultdata name={'Loss'} value={Loss}  />
  <Resultdata name={'Average Loss'} value={AverageLoss}  />
  <Resultdata name={'ORL'} value={ORL}  />
  <Resultdata name={'Average Splice Loss'} value={AverageSplice.toFixed(3)}  />
  <Resultdata name={'Max. Splice Loss'} value={maxloss}  />
  <Resultdata name={'Noise Floor'} value={NoiseFloor}  />
 </div>
  )
}

export default Rightbar