import React, {useState} from 'react';
import {SimpleBtn} from '~/components';
import { $Post } from '~/util/requestapi';
import {
  setReportselectedlist,
  setReportserReport,
  setAlldeletereports,
  alldeletereporttype,
  ReportsetReporttype,
  setReportsetlist,
  createreportsetlist
} from './../../../store/slices/reportslice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
function CreateReportset() {
  const disptch=useDispatch()
  const navigate=useNavigate()
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [loading,setLoading]=useState(false)
  const [validateerror, setValidateerror] = useState(false);
  const save=async()=>{
    if(name.length == 0){
      setValidateerror(true)
    }else{
     try {
      setLoading(true)
      const cretereportset=await $Post(`otdr/report-set/`,{
       name: name,
       comment: comments
     })
     if(cretereportset?.status == 201){
      toast('It was done successfully', {type: 'success', autoClose: 1000});
      setLoading(false)
      const cretereportsetresponsdata=await cretereportset.json()
      disptch(createreportsetlist({name:name,id:cretereportsetresponsdata}))
      navigate(`/reporting/reports/${cretereportsetresponsdata}`)
     }
     } catch (error) {
      toast('It was done successfully', {type: 'success', autoClose: 1000});
      console.log(`crete report error is:${error}`);
     } finally {
      setLoading(false)
     }
      setValidateerror(false)
    }
  }
  return (
    <div className="flex w-full relative flex-col p-[20px] h-[100%-80px]">
      <h1 className='font-bold mb-6'> create reportset</h1>
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
        <SimpleBtn loading={loading} onClick={save}>Save</SimpleBtn>
        <SimpleBtn className='ml-[10px]'>Cancel</SimpleBtn>
      </div>
    </div>
  );
}

export default CreateReportset;
