
import {Form, FormikProvider, useFormik, validateYupSchema} from 'formik';
import * as Yup from 'yup';
import React, {ReactNode} from 'react';
import {FC, useState} from 'react';
import {useSelector} from 'react-redux';
import { Outlet, useNavigate, useParams} from 'react-router-dom';
import {SimpleBtn, TabItem} from '~/components';
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
  IOR:Yup.number().required('Please enter IOR'),
  RBS:Yup.number().required('Please enter RBS'),
  event_loss_threshold:Yup.number().required('Please enter event_loss_threshold'),
  event_reflection_threshold:Yup.number().required('Please enter event_reflection_threshold'),
   total_loss_threshold:Yup.number().required('Please enter total_loss_threshold'),
  section_loss_threshold:Yup.number().required('Please enter section_loss_threshold'),
  fiber_end_threshold:Yup.number().required('Please enter fiber_end_threshold'),
  Injection_Level_Threshold:Yup.number().required('Please enter Injection_Level_Threshold'),

});
const Row = ({children, name}: Iprops) => {
  return (
    <div className="flex w-[700px] flex-row items-center  justify-between mb-[20px]">
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
  const navigate=useNavigate()
  const formik = useFormik({
    validationSchema:rtuSchema,
    initialValues: {
      type: '',
      station: '',
      Wavelength: '',
      BreakStrategy: '',
      DataSavePolicy: '',
      TestMode: '',
      RunMode: '',
      DistanceMode: '',
      Range: '',
      PulseWidthMode: '',
      PulseWidthns: '',
      SamplingMode: '',
      IOR:"",
      samplingduration:"",
      RBS:"",
      event_loss_threshold:"",
      event_reflection_threshold:"",
      total_loss_threshold:"",
      section_loss_threshold:"",
      fiber_end_threshold:"",
      Injection_Level_Threshold:""
    },
    onSubmit: async values => {},
  });

  return (
    <AppDialog
    closefunc={()=> navigate(-1)}
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
      <FormikProvider  value={formik}>
      <Form className="flex h-full flex-col justify-between">
        <Row name="Type">
          <SelectFormik placeholder="select" name="type" className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.type}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.type}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              monitoring
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              maintenance
            </option>
          </SelectFormik>
        </Row>

        <Row name="Station">
          <SelectFormik
            placeholder="select"
            name="station"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.station}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.station}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              station1
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              station1
            </option>
          </SelectFormik>
        </Row>

        <Row name="Rtu">
          <SelectFormik placeholder="select" name="type" className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.station}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.station}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              rtu1
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              rtu2
            </option>
          </SelectFormik>
        </Row>

        <Row name="Wavelength (nm)">
          <SelectFormik
            placeholder="select"
            name="Wavelength"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.Wavelength}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.Wavelength}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              1310
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              1490
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              1550
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              1625
            </option>
          </SelectFormik>
        </Row>

        <Row name="Break Strategy">
          <SelectFormik
            placeholder="select"
            name="BreakStrategy"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.BreakStrategy}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.BreakStrategy}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              skip
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              continue
            </option>
          </SelectFormik>
        </Row>

        <Row name="Data Save Policy">
          <SelectFormik
            placeholder="select"
            name="DataSavePolicy"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.DataSavePolicy}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.DataSavePolicy}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              save
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              do_not_save
            </option>
          </SelectFormik>
        </Row>

        <Row name="Test Mode">
          <SelectFormik
            placeholder="select"
            name="TestMode"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.TestMode}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.TestMode}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              fast
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              precision
            </option>
          </SelectFormik>
        </Row>

        <Row name="Run Mode">
          <SelectFormik
            placeholder="select"
            name="RunMode"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.RunMode}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.RunMode}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              average
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              realtime
            </option>
          </SelectFormik>
        </Row>

        <Row name="Distance Mode">
          <SelectFormik
            placeholder="select"
            name="DistanceMode"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.DistanceMode}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.DistanceMode}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              manual
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              automatic
            </option>
          </SelectFormik>
        </Row>

        <Row name="Range (km)">
          <SelectFormik placeholder="select" name="Range" className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.Range}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.Range}
            </option>
            {rangeoptions.map(data => (
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                {data}
              </option>
            ))}
          </SelectFormik>
        </Row>

        <Row name="Pulse Width Mode">
          <SelectFormik
            placeholder="select"
            name="PulseWidthMode"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.PulseWidthMode}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.PulseWidthMode}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              automatic
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              manual
            </option>
          </SelectFormik>
        </Row>

        <Row name="Pulse Width Mode">
          <SelectFormik
            placeholder="select"
            name="PulseWidthMode"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.PulseWidthns}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.PulseWidthns}
            </option>
            {pluswidthoptions.map(data => (
              <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                {data}
              </option>
            ))}
          </SelectFormik>
        </Row>

        <Row name="Sampling Mode">
          <SelectFormik
            placeholder="select"
            name="SamplingMode"
            className="w-[400px]">
            <option value="" className="hidden">
              {formik.values.SamplingMode}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.SamplingMode}
            </option>

            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              duration
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              automatic
            </option>
            <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
              repetition
            </option>
          </SelectFormik>
        </Row>

        <Row name="Sampling Duration">
          {formik.values.SamplingMode == 'automatic' ? null : (
            <InputFormik
              onchange={e => {}}
              outerClassName="w-[360px]"
              wrapperClassName="w-[400px]"
              name="samplingduration"
              type="number"
            />
          )}
        </Row>

        <Row name="IOR">
        <InputFormik
              min={1.3}
              max={1.8}
              step={0.000001}
              onchange={e => {
            
              }}
              outerClassName="w-[400px]"
              wrapperClassName="w-[400px]"
              name="IOR"
              type="number"
            />
        </Row>

        <Row name="RBS (dB)">
        <InputFormik
              min={-90}
              max={-40}
              step={0.01}
              onchange={e => {
            
              }}
              outerClassName="w-[400px]"
              wrapperClassName="w-[400px]"
              name="RBS"
              type="number"
            />
        </Row>

        <Row name="Event Loss threshold (dB)">
        <InputFormik
              min={0}
              max={9.99}
              step={0.01}
              onchange={e => {
            
              }}
              outerClassName="w-[400px]"
              wrapperClassName="w-[400px]"
              name="event_loss_threshold"
              type="number"
            />
        </Row>

        <Row name="Event Reflection Threshold (dB)">
        <InputFormik
              min={-65}
              max={-14}
              step={0.1}
              onchange={e => {
             
              }}
              outerClassName="w-[400px]"
              wrapperClassName="w-[400px]"
              name="event_reflection_threshold"
              type="number"
            />
        </Row>

        <Row name="Fiber End Threshold (dB)">
        <InputFormik
              min={0.01}
              max={9.99}
              step={0.01}
              onchange={e => {
           
              }}
              outerClassName="w-[400px]"
              wrapperClassName="w-[400px]"
              name="fiber_end_threshold"
              type="number"
            />
        </Row>

        <Row name="Total Loss Threshold (dB)">
        <InputFormik
              min={0}
              max={40}
              step={0.01}
              onchange={e => {
         
              }}
              outerClassName="w-[400px]"
              wrapperClassName="w-[400px]"
              name="total_loss_threshold"
              type="number"
            />
        </Row>

        <Row name="Injection Level Threshold (dB)">
        <InputFormik
              min={0}
              max={40}
              step={0.01}
              onchange={e => {
              
              }}
              outerClassName="w-[400px] mt-0"
              wrapperClassName="w-[400px] mt-0"
              name="Injection_Level_Threshold"
              type="number"
            />
        </Row>
        <div className='w-full flex justify-end pb-[20px]'>
        <div className="flex gap-x-4">
            <SimpleBtn  type="submit">
              Save
            </SimpleBtn>
            <SimpleBtn onClick={()=>navigate(-1)} type='button' className="cursor-pointer " >
              Cancel
            </SimpleBtn>
          </div>
        </div>
       
</Form>
      </FormikProvider>
      {/* <div className="flex h-full w-full flex-col">
        <Outlet key={"status"} />
      </div> */}
    </AppDialog>
  );
};

export default Detail;
