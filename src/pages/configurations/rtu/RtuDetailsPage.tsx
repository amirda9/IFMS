import {Form, FormikProvider, useFormik} from 'formik';

import {FC} from 'react';
import {
  ControlledSelect,
  Description,
  SimpleBtn,
  TextInput,
} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import {InputFormik} from '~/container';
type Rowtext = {
  name: string;
  value: string;
};

const Rowtext = ({name, value}: Rowtext) => {
  return (
    <div className="flex flex-row mb-[4px]">
      <span className="w-[162px] text-[18px] font-light leading-[24.2px]">
        {name}
      </span>
      <span className="text-[18px] font-light leading-[24.2px]">{value}</span>
    </div>
  );
};

const RtuDetailsPage: FC = () => {
  const formik = useFormik({
    initialValues: {
      name: 'RTU1',
      OTDRSECEND: '',
      SWITCHSECEND: '',
      SubnetMask: '',
    },
    onSubmit: () => {},
  });
  console.log(formik.values, 'fff');

  return (
    <div className="flex flex-grow">
      <FormikProvider value={formik}>
        <Form className="flex flex-grow flex-col gap-y-8">
          <div className="flex flex-grow flex-col gap-y-4">
            <Description
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Name">
              <InputFormik
                name="name"
                className="text-[18px] font-light leading-[24.2px]"
                wrapperClassName="w-3/5"
              />
            </Description>
            <Description
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Model">
              <ControlledSelect
                options={[{label: 'Model1'}]}
                onChange={value => {
                  formik.setFieldValue('model', value);
                }}
                className="w-[400px] text-[18px] font-light leading-[24.2px]"
              />
            </Description>
            <Description
              labelClassName="text-[18px] font-light leading-[24.2px] mb-[4px]"
              label="Contact Person">
              <ControlledSelect
                options={[{label: 'User2'}]}
                onChange={value => {
                  formik.setFieldValue('contactUser', value);
                }}
                className="w-[400px] text-[18px] font-light leading-[24.2px]"
              />
            </Description>
            <div className="mb-[4px] flex w-full flex-row">
              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="W-[30%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="OTDR IP & Port">
                  <InputFormik
                    name="OTDR IP & Port"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
                <InputFormik
                  type="number"
                  name="OTDRSECEND"
                  wrapperClassName="w-[70px] ml-[15px] text-[18px] font-light leading-[24.2px]"
                />
              </div>

              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="w-[70%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="Switch IP & Port">
                  <InputFormik
                    name="Switch IP & Port"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
                <InputFormik
                  type="number"
                  name="SWITCHSECEND"
                  wrapperClassName="w-[70px] ml-[15px] text-[18px] font-light leading-[24.2px]"
                />
              </div>
            </div>

            <div className="mb-[4px] flex w-full flex-row">
              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="W-[30%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="Subnet Mask">
                  <InputFormik
                    name="Subnet Mask"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                    onChange={value => {
                      console.log(value);
                      formik.setFieldValue('SubnetMask', value);
                    }}
                  />
                </Description>
              </div>

              <div className="flex w-[50%] flex-row xl:w-[500px]">
                <Description
                  className="w-[70%]"
                  labelClassName="text-[18px] font-light leading-[24.2px]"
                  label="Default Gateway">
                  <InputFormik
                    name="Switch IP & Port"
                    wrapperClassName="w-[206px] text-[18px] font-light leading-[24.2px]"
                  />
                </Description>
              </div>
            </div>
            <div className="mb-[4px] flex w-full flex-row">
              <span className="text-[18px] font-light leading-[24.2px]">
                Connection
              </span>
              <span className="ml-[65px] text-[18px] font-light leading-[24.2px] text-[#0E9836]">
                Online
              </span>
              <Checkbox
                onclick={() => {}}
                classname={'w-[24px] h-[24px] ml-[100px]'}
              />
              <span className="ml-[10px] text-[18px] font-light leading-[24.2px]">
                Manual Offline
              </span>
            </div>
            <div className="mb-[4px] flex w-full flex-row">
              <span className="text-[18px] font-light leading-[24.2px]">
                Status
              </span>
              <span className="ml-[110px] text-[18px] font-light  leading-[24.2px]">
                Idle
              </span>
              <Checkbox
                onclick={() => {}}
                classname={'w-[24px] h-[24px] ml-[122px]'}
              />
              <span className="ml-[10px] text-[18px] font-light leading-[24.2px]">
                Manual Stop
              </span>
            </div>

            <Rowtext name="Last Comm." value="2023-12-30 14:29:45" />
            <Rowtext name="Last  Sync" value="2023-12-30 14:29:45" />
            <Rowtext name="Created" value="2023-12-30 14:29:45" />
            <Rowtext name="Last Modified" value="2023-12-30 14:29:45" />
            <Rowtext name="Owner" value="Admin" />
            {/* --------------------------------------------------- */}
          </div>
          <div className="flex gap-x-4 self-end">
            <SimpleBtn type="submit">Save</SimpleBtn>
            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default RtuDetailsPage;
