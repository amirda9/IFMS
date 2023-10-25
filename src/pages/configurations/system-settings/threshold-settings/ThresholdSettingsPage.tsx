import React, {ReactNode} from 'react';
import {FormLayout} from '~/layout';
import {Description, Select, SimpleBtn, TextInput} from '~/components';

type Rowinputtype = {
  name: string;
  children: ReactNode;
};

const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="flex w-[700px] flex-row justify-between">
      <span className="w-[400px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};
// -------------------- main --------------------------- main ---------------------- main --------------------- main --------
const ThresholdSettingsPage = () => {
  const buttons = (
    <>
      <SimpleBtn>Save</SimpleBtn>
      <SimpleBtn>Reset to Default</SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  return (
    <FormLayout buttons={buttons}>
      <div className="flex flex-col gap-y-4">
        <Rowinput name="Wavelength">
          <Select className="w-full">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>Continue</option>
            <option>Skip</option>
          </Select>
        </Rowinput>
        <Rowinput name="Total Loss (dB)">
          <TextInput type="number" className="w-full" defaultValue={1} />
        </Rowinput>
        <Rowinput name="Section Loss (dB)">
          <TextInput type="number" className="w-full" defaultValue={0.1} />
        </Rowinput>
        <Rowinput name="Event Loss (dB)">
          <TextInput type="number" className="w-full" defaultValue={0.1} />
        </Rowinput>
        <Rowinput name="Event Reflectance (dB)">
          <TextInput type="number" className="w-full" defaultValue={1} />
        </Rowinput>
        <Rowinput name="Injection Level (dB)">
          <TextInput type="number" className="w-full" defaultValue={1} />
        </Rowinput>
      </div>
    </FormLayout>
  );
};

export default ThresholdSettingsPage;
