import React, {useEffect, useState} from 'react';
import checkimage from '~/assets/images/check.svg';
type Iprops={
 onclick:Function,
 classname:string
}
function Checkbox({onclick,classname}:Iprops) {
  const [check, setCheck] = useState(false);

   useEffect(()=>{
    onclick(check)
   },[check])
  return (
    <button onClick={()=>setCheck(!check)} className={`w-[20px] h-[20px] bg-[#FFFFFF] ${classname}`}>
      {check ? <img src={checkimage} className="mb-4 w-[20px] h-[19.5px]" /> : null}
    </button>
  );
}

export default Checkbox;
