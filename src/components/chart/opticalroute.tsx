import React from 'react'
import Selectbox from '~/components/selectbox/selectbox';
type Resultdata={
 name:string,
 value:string
}

type Iprops={
 onclick:(name:string)=>void,
 Wavelength:string
 data: {
  optical_route_name: string,
  source_station_name: string,
  destination_station_name: string,
  rtu_name: string
},
}
const options = [
  {value: 'Result', label: 'Result'},
  {value: 'Optical Route', label: 'Optical Route'},
  {value: 'Alarms', label: 'Alarms'},
];

const Resultdata=({name,value}:Resultdata)=>{
 return(
  <div className='flex flex-row justify-between items-center mb-[20px] w-full '>
  <span className='text-[20px] w-[197px] text-[#000000] font-light leading-[24.2px]'>
 {name}
  </span>
  <span className='text-[20px] w-[170px] btext-[#000000] text-right pr-[20px] font-light leading-[24.2px]'>
  {value}
  </span>
 </div>
 )
}
function Opticalroute({onclick,Wavelength,data}:Iprops) {
  console.log("optical-data",data);
  
  return (
   <div className="h-full w-full bg-[#C6DFF8] p-[10px] box-border rounded-[10px]">
   <Selectbox
   defaultvalue='Optical Route'
     onclickItem={(e: {value: string; label: string}) => onclick(e.label)}
     options={options}
     borderColor={'black'}
     classname={'w-full h-[40px] rounded-[10px] mb-[25px]'}
   />
  <Resultdata name={'Optical Route name'} value={data?.optical_route_name}  />
  <Resultdata name={'Source Station'} value={data?.source_station_name}  />
  <Resultdata name={'Destination Station'} value={data?.destination_station_name}  />
  <Resultdata name={'RTU Name'} value={data?.rtu_name}  />
  <Resultdata name={'Wavelength'} value={Wavelength}  />
 </div>
  )
}

export default Opticalroute