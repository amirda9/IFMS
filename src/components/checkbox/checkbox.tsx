import React, {useEffect, useState} from 'react';
import checkimage from '~/assets/images/check.svg';
import { HiMiniCheck } from "react-icons/hi2";
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
    <button type='button' onClick={()=>onclick(!check)} className={`w-[20px] flex flex-row justify-center items-center  h-[20px] bg-[#FFFFFF] ${classname}`}>
      {check ? <HiMiniCheck  size={30} />: null}
    </button>
  );
}

export default Checkbox;
