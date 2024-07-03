import React from 'react'
import { TextInput } from '~/components'
const AlarmRow=({title,data}:{title:string,data:string})=>{
 return(
  <div className='flex flex-row justify-between items-center mb-5'>
   <span className='text-[20px]  leading-[24.2px] font-normal'>{title}</span>
   <TextInput 
   defaultValue={data}
   className='w-[calc(100%-200px)] h-[40px] bg-white rounded-[10px]'
   />

  </div>
 )
}
function AlarmDetailPage() {
  return (
    <div className='w-full flex flex-row justify-between'>
     <div className='w-[45%] flex flex-col'>
     <AlarmRow title='Alarm Type' data='Link' />
     <AlarmRow title='State' data='In Progress' />
     <AlarmRow title='Network' data='Network 1' />
     <AlarmRow title='Link' data='Link2' />
     <AlarmRow title='Cable' data='Cable1' />
     <AlarmRow title='Core' data='1' />
     <AlarmRow title='To Escalation' data='1 Day - 2 Hours - 23 Minutes' />
     <AlarmRow title='Alarm Time' data='2023-12-30 20:18:43' />
     </div>

     <div className='w-[45%] flex flex-col'>
     <AlarmRow title='Severity' data='Fiber Fault' />
     <AlarmRow title='# Alarms' data='2' />
     <AlarmRow title='Region' data='Region 1' />
     <AlarmRow title='Station' data='Station2' />
     <AlarmRow title='RTU' data='Station2' />
     <AlarmRow title='Port' data='1' />
     <AlarmRow title='To Time Out' data='1 Day - 2 Hours - 23 Minutes' />
     <AlarmRow title='Last Modified' data='2024-8-23 20:18:43' />
     </div>
    </div>
  )
}

export default AlarmDetailPage