import React, {useState} from 'react';
import {SimpleBtn} from '~/components';

function Reports() {
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [validateerror, setValidateerror] = useState(false);
  const save=()=>{
    if(name.length == 0){
      setValidateerror(true)
    }else{
      setValidateerror(false)
    }
  }
  return (
    <div className="flex w-full relative flex-col p-[20px] h-[100%-80px]">
      <div className="relative flex w-[750px] flex-row items-center justify-between">
        <span className="w-[106px] text-[20px] font-normal leading-[24.2px]">
          Name
        </span>
        <input
          onChange={e => setName(e.target.value)}
          className="h-[40px] p-[10px] w-[600px] rounded-[10px] border-[1px] border-black bg-white"
        />
        {validateerror?
             <span className="absolute left-[150px]  top-[45px] text-[red]">
             please inter name
           </span>
      :null
      }
   
      </div>

      <div className="mt-[50px] flex w-[750px] flex-row items-start justify-between">
        <span className="w-[106px]  text-[20px] font-normal leading-[24.2px]">
          Comment
        </span>
        <textarea
          onChange={e => setComments(e.target.value)}
          className="h-[80px] w-[600px] p-[10px] rounded-[10px] border-[1px] border-black bg-white"
        />
      </div>

      <div className="flex flex-row absolute right-0 bottom-0">
        <SimpleBtn onClick={save}>Save</SimpleBtn>
        <SimpleBtn className='ml-[10px]'>Cancel</SimpleBtn>
      </div>
    </div>
  );
}

export default Reports;
