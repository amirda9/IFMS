import React, {ReactNode, useRef, useState} from 'react';
import * as Yup from 'yup';
import {Form, FormikProvider, useFormik, validateYupSchema} from 'formik';
import {InputFormik, SelectFormik} from '~/container';
import {SimpleBtn} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import dateicon from '~/assets/images/dateicon.png';
import RadioButton from '~/components/radipbutton/radiobutton';
type Iprops = {
  children: ReactNode;
  name: string;
  classname?: string;
  ReportType?:string
};

const rtuSchema = Yup.object().shape({
  name: Yup.string().required('Please enter name'),
  Everyvalue: Yup.string().required('Please enter Everyvalue'),
});

const Row = ({children, name, classname}: Iprops) => {
  return (
    <div
      className={`mb-[20px] flex w-[900px] flex-row  items-center justify-between ${classname}`}>
      <span className="text-[20px] font-normal leading-[24.2px]">{name}</span>
      <div className="w-[720px]">{children}</div>
    </div>
  );
};

function ReportsDetailpage() {
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);
  const [Time, setTime] = useState('');
  const [timefilter,setTimefilter]=useState(false)
  const formik = useFormik({
    validationSchema: rtuSchema,
    initialValues: {
      name: '',
      Everyvalue: '',
    },
    onSubmit: async values => {},
  });
  return (
    <div className="fex-col relative flex w-full p-[20px]">
      <FormikProvider value={formik}>
        <Form className="flex h-full flex-col">
          <Row name="name">
            <InputFormik
              // outerClassName="w-[720px]"
              wrapperClassName="w-[720px]"
              className="h-[40px]"
              name="name"
              type="text"
            />
          </Row>

          <Row name="Comment">
            <InputFormik
              className="mb-[-45px] h-[80px] w-[720px]"
              wrapperClassName="w-[720px]"
              name="comment"
              type="text"
            />
          </Row>

          <Row classname="mt-[28px]" name="Report Type">
            <div className="flex w-[550px] flex-row">
              <SelectFormik
                placeholder="select"
                name="ReportType"
                className="h-[40px] w-[400px]">
                {/* <option value="" className="hidden">
              {formik.values.station}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.station}
            </option> */}

                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  station1
                </option>
                <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                  station1
                </option>
              </SelectFormik>
              <SimpleBtn>Filter</SimpleBtn>
            </div>
          </Row>

          <div className="mb-[17px] flex w-[940px]  flex-row  items-center justify-between pr-[18px]">
            <div className="flex flex-row">
              <Checkbox
              
                checkstatus={timefilter}
                onclick={e => setTimefilter(!timefilter)}
                iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px] text-[#18C047]"
                classname={
                  'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] text-[#18C047] border-[#000000]'
                }
              />
              <span className="ml-[10px] text-[20px] font-normal">
                Time Filter
              </span>
            </div>
            <div className="flex   w-[740px] flex-col">
              <div className="flex w-full flex-row items-center">
                <RadioButton
                  check={Time == 'Exact' ? true : false}
                  onclick={() => setTime('Exact')}
                />
                <span className="ml-[10px] mr-[37px] text-[20px] font-normal leading-6">
                  Exact Time
                </span>
                <span className="text-[20px] font-normal leading-6">From</span>
                <input
                  ref={firstdateref}
                  onChange={e => {}}
                  value={''}
                  type="date"
                  className="ml-4 h-[40px] w-[170px] cursor-pointer rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => firstdateref.current.showPicker()}
                  className="ml-[9px] h-[35px] w-[35px] cursor-pointer"
                />

                <span className="ml-10 text-[20px] font-normal leading-6">
                  to
                </span>
                <input
                  ref={secenddateref}
                  onChange={e => {}}
                  value={''}
                  type="date"
                  className="ml-4 h-[40px] w-[170px] rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => secenddateref.current.showPicker()}
                  className="ml-[9px] h-[35px] w-[35px] cursor-pointer"
                />
              </div>

              <div className="mt-[10px] flex w-[424px] flex-row items-center">
                <RadioButton
                  check={Time == 'Relative' ? true : false}
                  onclick={() => setTime('Relative')}
                />
                <span className="ml-[10px] mr-[15px] text-[20px] font-normal leading-6">
                  Relative Time
                </span>
                <span className="text-[20px] font-normal leading-6">Every</span>
                <InputFormik
                  className="ml-[8px] h-[40px] w-[70px]"
                  wrapperClassName="w-[70px]"
                  name="Everyvalue"
                  type="number"
                />
                <SelectFormik
                  placeholder="select"
                  name="station"
                  className="ml-[5px] h-[40px] w-[90px]">
                  {/* <option value="" className="hidden">
              {formik.values.station}
            </option>
            <option value={undefined} className="hidden">
              {formik.values.station}
            </option> */}

                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    Months
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    Days
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    Years
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    Hours
                  </option>
                </SelectFormik>
              </div>
            </div>
          </div>

          <div className="mb-[16px] flex w-[900px]  flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-[24.2px]">
              Owner
            </span>
            <span className="w-[720px]">Admin</span>
          </div>

          <div className="mb-[16px] flex w-[900px]  flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-[24.2px]">
              Created
            </span>
            <span className="w-[720px]">2023-12-30 20:18:43</span>
          </div>

          <div className="mb-[16px] flex w-[900px]  flex-row items-center justify-between">
            <span className="text-[20px] font-normal leading-[24.2px]">
              Last Modified
            </span>
            <span className="w-[720px]">2023-12-30 20:18:43</span>
          </div>
          <div className="absolute bottom-0 right-0 flex flex-row items-center">
        <SimpleBtn>Open Report</SimpleBtn>

        <SimpleBtn type='submit' className="mx-[5px]">Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
        </Form>
      </FormikProvider>

    </div>
  );
}

export default ReportsDetailpage;
