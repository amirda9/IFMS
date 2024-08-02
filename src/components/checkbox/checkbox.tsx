import React, {useEffect, useState} from 'react';
import checkimage from '~/assets/images/check.svg';
import {HiMiniCheck} from 'react-icons/hi2';
type Iprops = {
  onclick: (e: boolean) => void;
  classname?: string;
  iconclassnam?: string;
  checkstatus?: boolean;
  disabledcheckbox?: boolean;
};
function Checkbox({
  onclick,
  classname="",
  iconclassnam = 'w-[20px] h-[19.5px]',
  checkstatus = false,
  disabledcheckbox = false,
}: Iprops) {
  const [check, setCheck] = useState(checkstatus);
  const [mount, setMount] = useState(false);
  useEffect(() => {
    setCheck(checkstatus);
  }, [checkstatus]);

  // useEffect(()=>{
  //   if(mount){
  //     onclick(check)
  //   }else{
  //     setMount(true)
  //   }

  // },[check])

  return (
    <button
      disabled={disabledcheckbox}
      type="button"
      onClick={e => {
        e.stopPropagation(), onclick(!check);
      }}
      className={`flex h-[20px] w-[20px] flex-row items-center justify-center ${disabledcheckbox?"opacity-10":"opacity-100"} bg-[#FFFFFF]  ${classname}`}>
      {check ? <HiMiniCheck size={30} /> : null}
    </button>
  );
}

export default Checkbox;
