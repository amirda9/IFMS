import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import { toast } from 'react-toastify';
import {SimpleBtn} from '~/components';
import {$Get, $Put} from '~/util/requestapi';
import {updaterportsetname} from './../../../store/slices/reportslice'
import { useDispatch } from 'react-redux';
function Reports() {
  const dispatch=useDispatch()
  const {reportid} = useParams();
  const [loading, setLoading] = useState(false);
  const [updateloading,setUpdateLoading]=useState(false)
  const [name, setName] = useState('');
  const [comments, setComments] = useState('');
  const [validateerror, setValidateerror] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      
      const getdetail = async () => {
        const response = await $Get(`otdr/report-set/${reportid}`);
        console.log('response', response);
  
        if (response?.status == 200) {
          const responsedata: {
            name: string;
            comment: string;
            id: string;
            reports: [];
          } = await response.json();
          setName(responsedata?.name);
          setComments(responsedata.comment);
        }
      };
      getdetail();
    } catch (error) {
      console.log(`get reportset detail error is:${error}`);
    } finally {
      setLoading(false);
    }
  }, [reportid]);

  const save = async () => {
    if (name.length == 0) {
      setValidateerror(true);
    } else {
      try {
        setUpdateLoading(true)
        const updatereportdetail=await $Put(`otdr/report-set/${reportid}`,{
          name: name,
          comment: comments
        })
        if(updatereportdetail?.status == 201){
          dispatch(updaterportsetname({reportsetId:reportid!,name:name}))
          toast('It was done successfully', {type: 'success', autoClose: 1000});
        } else{
          toast('Encountered an error', {type: 'error', autoClose: 1000});
        }
      } catch (error) {
        console.log(`update report detail error is:${error}`);
      } finally {
        setUpdateLoading(false)
      }
      setValidateerror(false);
    }
  };

  console.log('reportid', reportid);
  if (loading) {
    return <h1>loading...</h1>
  }
  return (
    <div className="relative flex h-[100%-80px] w-full flex-col p-[20px]">
      <div className="relative flex w-[750px] flex-row items-center justify-between">
        <span className="w-[106px] text-[20px] font-normal leading-[24.2px]">
          Name
        </span>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          className="h-[40px] w-[600px] rounded-[10px] border-[1px] border-black bg-white p-[10px]"
        />
        {validateerror ? (
          <span className="absolute left-[150px]  top-[45px] text-[red]">
            please inter name
          </span>
        ) : null}
      </div>

      <div className="mt-[50px] flex w-[750px] flex-row items-start justify-between">
        <span className="w-[106px]  text-[20px] font-normal leading-[24.2px]">
          Comment
        </span>
        <textarea
          value={comments}
          onChange={e => setComments(e.target.value)}
          className="h-[80px] w-[600px] rounded-[10px] border-[1px] border-black bg-white p-[10px]"
        />
      </div>

      <div className="absolute bottom-0 right-0 flex flex-row">
        <SimpleBtn loading={updateloading} onClick={save}>Save</SimpleBtn>
        <SimpleBtn className="ml-[10px]">Cancel</SimpleBtn>
      </div>
    </div>
  );
}

export default Reports;
