import React, { useEffect, useState } from 'react'
import Selectbox from '~/components/selectbox/selectbox';
type Resultdata={
 name:string,
 value:string | number
}

type alllalarmsType=[
  {
    alarm: {
      id: string,
      name: string
    },
    severity: string
  }
] | []
type Iprops={
 onclick:(name:string)=>void
 data:alllalarmsType
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
function Alarms({onclick,data}:Iprops) {
  const [heighalarms,setHeighalarms]=useState(0)
  const [mediumalarms,setMediumalarms]=useState(0)
  const [lowalarms,setLowalarms]=useState(0)
  useEffect(()=>{
    let lowalarm=0
    let hightalarm=0
    let mediumalarm=0
for(let i=0;i<data.length;i++){
  if(data[i].severity == "Heigh"){
    hightalarm += 1
  }

  if(data[i].severity == "Medium"){
    mediumalarm += 1
  }
  if(data[i].severity == "Low"){
    lowalarm += 1
  }
}
setHeighalarms(heighalarms)
setLowalarms(lowalarms)
setMediumalarms(mediumalarm)
  },[])
  return (
   <div className="h-full overflow-y-auto overflow-x-hidden w-full bg-[#C6DFF8] p-[10px] box-border rounded-[10px]">
   <Selectbox
   defaultvalue='Alarms'
     onclickItem={(e: {value: string; label: string}) => onclick(e.label)}
     options={options}
     borderColor={'black'}
     classname={'w-full h-[40px] rounded-[10px] mb-[25px]'}
   />
  <Resultdata name={'# High Severity'} value={heighalarms}  />
  <Resultdata name={'# Medium Severity'} value={mediumalarms}  />
  <Resultdata name={'# Low Severity'} value={lowalarms}  />
  {data.map((data)=>
  <>
  <div className='w-full border-t-[1px] border-[black] mb-[5px]'></div>
   <Resultdata name={'#1'} value={''}  />
   <Resultdata name={'Name'} value={data.alarm.name}  />
   <Resultdata name={'Severity'} value={data.severity}  />
   <Resultdata name={'Event Number'} value={'2'}  />
  </>
   
  )}
 

 </div>
  )
}

export default Alarms