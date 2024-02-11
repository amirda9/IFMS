import {Form, FormikProvider, useFormik} from 'formik';
import {FC, useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {Description, SimpleBtn} from '~/components';
import {InputFormik, TextareaFormik} from '~/container';
import { RootState } from '~/store';
import { alarmtypedetailtype, setalarmlist, setalarmsdetail } from '~/store/slices/alarmstypeslice';
import { deepcopy } from '~/util';
import { $Get, $Put } from '~/util/requestapi';
import { getPrettyDateTime } from '~/util/time';

type FormType = {
  name: string;
  comment: string;
  sourceDataSet: string;
};

const AlarmTypeDetailsPage: FC = () => {
  const params=useParams()
  const dispatch=useDispatch()

  const {alarmtypedetail,alarmtypelist} = useSelector((state: RootState) => state.alarmtypes);
console.log(params.alarmId);

  useEffect(()=>{
const getalarmdetail=async ()=>{
  const alarmdetailresponse=await $Get(`otdr/alarm/${params.alarmId}`)
  if(alarmdetailresponse.status == 200){
    const alarmdetailresponsedata=await alarmdetailresponse.json()
    let alarmdetailresponsedataCopy:alarmtypedetailtype=deepcopy(alarmdetailresponsedata)
    if(!alarmdetailresponsedataCopy.alarm_definition){
      alarmdetailresponsedataCopy={...alarmdetailresponsedata,alarm_definition:{
        low_severity: {
          conditions: [
          ],
          fault: 'No'
        },
        medium_severity: {
          conditions: [
        
          ] ,
          fault: "No"
        },
        high_severity: {
          conditions: [
        
          ],
          fault: "No"
        }
      },}
    }
    dispatch(setalarmsdetail(alarmdetailresponsedataCopy))
  }
}
getalarmdetail()
  },[])

  const formik = useFormik<FormType>({
    enableReinitialize: true,
    initialValues: {
      name: alarmtypedetail.name,
      comment: alarmtypedetail.comment,
      sourceDataSet: 'Fiber Result',
    },
    onSubmit: async(values) => {
      const updatealarmtypedetail=await $Put(`otdr/alarm/${params!.alarmId!}`,{name:values.name,
      comment:values.comment})
      if(updatealarmtypedetail.status == 201){
        const alarmtypelistCopy=deepcopy(alarmtypelist)
        const findalarmindex=alarmtypelist.findIndex(data => data.id == params!.alarmId!)
        alarmtypelistCopy[findalarmindex].name =values.name
        dispatch(setalarmlist(alarmtypelistCopy))
      }
    },
  });
  return (
    <div className="flex flex-grow flex-col">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col justify-between">
          <div className="flex w-2/3 flex-col gap-y-4">
            <Description label="Name" className="flex-grow">
              <InputFormik name="name" wrapperClassName="w-full" />
            </Description>

            <Description label="Comment" labelClassName="mt-[-30px]">
              <TextareaFormik name="comment" />
            </Description>
            {/* 
            <Description label="Source Data Set">
              <ControlledSelect
                options={[{label: 'Fiber Result'}]}
                value={formik.values.sourceDataSet || ''}
                onChange={() => {}}
                className="min-w-[19rem]"
              />
            </Description> */}
            <Description label="Owner" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
                Admin
              </span>
            </Description>
            <Description label="Created" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
              {getPrettyDateTime(alarmtypedetail.time_created)}
              </span>
            </Description>
            <Description label="Last Modified" className="flex-grow">
              <span className="text-sm font-normal leading-[24.2px]">
              {getPrettyDateTime(alarmtypedetail.time_modified)}
              </span>
            </Description>
          </div>
          <div className="flex flex-row gap-x-4 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn link to="../">
              Cancel
            </SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default AlarmTypeDetailsPage;
