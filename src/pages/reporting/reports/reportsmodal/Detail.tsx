import {Form, FormikProvider, useFormik, validateYupSchema} from 'formik';
import * as Yup from 'yup';
import React, {ReactNode} from 'react';
import {FC, useState} from 'react';
import {useSelector} from 'react-redux';
import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Select, SimpleBtn, TabItem} from '~/components';
import AppDialog from '~/components/modals/AppDialog';
import {InputFormik, SelectFormik} from '~/container';
import {useHttpRequest} from '~/hooks';
type Iprops = {
  children: ReactNode;
  name: string;
};

const rangeoptions = [0.5, 2.5, 5, 15, 40, 80, 120, 160, 200];
const pluswidthoptions = [3, 5, 10, 30, 50, 100, 275, 500, 100];
const rtuSchema = Yup.object().shape({
  // name: Yup.string().required('Please enter name'),
  // type: Yup.string().required('Please enter type'),
  IOR: Yup.number().required('Please enter IOR'),
  RBS: Yup.number().required('Please enter RBS'),
  event_loss_threshold: Yup.number().required(
    'Please enter event_loss_threshold',
  ),
  event_reflection_threshold: Yup.number().required(
    'Please enter event_reflection_threshold',
  ),
  total_loss_threshold: Yup.number().required(
    'Please enter total_loss_threshold',
  ),
  section_loss_threshold: Yup.number().required(
    'Please enter section_loss_threshold',
  ),
  fiber_end_threshold: Yup.number().required(
    'Please enter fiber_end_threshold',
  ),
  Injection_Level_Threshold: Yup.number().required(
    'Please enter Injection_Level_Threshold',
  ),
});
const Row = ({children, name}: Iprops) => {
  return (
    <div className="mb-[20px] flex w-[700px] flex-row  items-center justify-between">
      <span className="text-[20px] font-normal leading-[24.2px]">{name}</span>
      <div className="w-[360px]">{children}</div>
    </div>
  );
};
//this function get full date and time then produce full date
const convertDate = (date: string, time: string) => {
  var datetime = new Date(date + 'T' + time + ':00Z');
  return datetime.toISOString();
};
const Detail: FC = () => {
  const navigate = useNavigate();

  return (
    <AppDialog
      closefunc={() => navigate(-1)}
      footerClassName="flex justify-end"
      // footer={
      //   <div className="flex flex-col">
      //     <div className="flex gap-x-4">
      //       <SimpleBtn onClick={() => formik} type="button">
      //         Save
      //       </SimpleBtn>
      //       <SimpleBtn onClick={()=>navigate(-1)} className="cursor-pointer " >
      //         Cancel
      //       </SimpleBtn>
      //     </div>
      //   </div>
      // }
    >
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row">
          <span className="text-[18px] font-normal">Parameters</span>
          <Select
            className="ml-[25px] mr-[15px] w-[180px]"
            value={'Severity'}
            onChange={event => {}}>
            <option value="" className="hidden" />
            <option value={undefined} className="hidden" />
            <option>Severity</option>
          </Select>

          <span className="text-[18px] font-normal">Parameters</span>
          <Select
            className="ml-[25px] mr-[15px] w-[180px]"
            value={`= dd`}
            onChange={event => {}}>
            <option value="" className="hidden" />
            <option value={undefined} className="hidden" />
            <option>= dd</option>
          </Select>

          <span className="text-[18px] font-normal">Parameters</span>
          <Select
            className="ml-[25px] mr-[15px] w-[180px]"
            value={'High'}
            onChange={event => {}}>
            <option value="" className="hidden" />
            <option value={undefined} className="hidden" />
            <option>High</option>
          </Select>

          <SimpleBtn>Append</SimpleBtn>
        </div>

        <div className="fex-row mt-[40px] flex w-full">
          <span className="mt-[60px] text-[18px] font-normal">
            Select Query
          </span>
          <div className="ml-[15px]  flex w-[calc(100%-135px)] flex-col">
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex w-[270px] flex-row items-center justify-between">
                <button className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  (
                </button>
                <button className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  )
                </button>
                <button className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  OR
                </button>
                <button className="h-[40px] w-[60px] rounded-[10px] bg-[#B3BDF2]">
                  AND
                </button>
              </div>
              <SimpleBtn className="h-[40px]">Clear Last</SimpleBtn>
            </div>

            <div
              className="mt-[15px] flex h-[270px] w-full flex-row rounded-[10px] border-[1px] border-black
          bg-white"></div>
          </div>
        </div>
        <div className="my-[20px] flex w-full flex-row justify-end pr-[10px]">
          <SimpleBtn className="">Clear All</SimpleBtn>
          <SimpleBtn className="mx-[10px]">Set</SimpleBtn>
          <SimpleBtn className="">Cancel</SimpleBtn>
        </div>
      </div>
    </AppDialog>
  );
};

export default Detail;
