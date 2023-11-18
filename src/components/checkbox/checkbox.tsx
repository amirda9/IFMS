import React, {useEffect, useState} from 'react';
import checkimage from '~/assets/images/check.svg';
type Iprops={
 onclick:(e:boolean)=>void,
 classname:string,
 iconclassnam?:string,
 checkstatus?:boolean
}
function Checkbox({onclick,classname,iconclassnam="w-[20px] h-[19.5px]",checkstatus=false}:Iprops) {
  const [check, setCheck] = useState(checkstatus);
   const [mount,setMount]=useState(false)
  useEffect(()=>{
    setCheck(checkstatus)
  },[checkstatus])

  // useEffect(()=>{
  //   if(mount){
  //     onclick(check)
  //   }else{
  //     setMount(true)
  //   }
  
  // },[check])

  return (
    <button onClick={()=>onclick(!check)} className={`w-[20px] h-[20px] bg-[#FFFFFF] ${classname}`}>
      {check ? <img src={checkimage} className={`mb-4  ${iconclassnam}`} /> : null}
    </button>
  );
}

export default Checkbox;
