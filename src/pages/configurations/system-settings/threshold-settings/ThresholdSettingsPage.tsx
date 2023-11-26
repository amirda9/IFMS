import React, {ReactNode, useState} from 'react';
import {FormLayout} from '~/layout';
import {Description, Select, SimpleBtn, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';

type Rowinputtype = {
  name: string;
  children: ReactNode;
};
type thresholdsetting = {
  event_loss: number;
  event_reflectance: number;
  injection_level: number;
  section_loss: number;
  total_loss: number;
  wavelength: string;
};
const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="flex w-[700px] flex-row justify-between text-[20px] font-light leading-[24.2px] text-[#000000]">
      <span className="w-[400px] ">{name}</span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};
// -------------------- main --------------------------- main ---------------------- main --------------------- main --------
const ThresholdSettingsPage = () => {
  const {
    request,
    state: {SettingsGet, SettingsUpdatethreshold_setting},
  } = useHttpRequest({
    selector: state => ({
      SettingsGet: state.http.SettingsGet,
      SettingsUpdatethreshold_setting:
        state.http.SettingsUpdatethreshold_setting,
    }),
    initialRequests: request => {
      request('SettingsGet', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.SettingsUpdatethreshold_setting?.httpRequestStatus ===
          'loading' &&
        state.SettingsUpdatethreshold_setting!.httpRequestStatus === 'success'
      ) {
        request('SettingsGet', undefined);
      }
    },
  });

  const [threshold_setting, setThreshold_setting] = useState<thresholdsetting>(
    SettingsGet?.data?.threshold_setting || {
      event_loss: 0,
      event_reflectance: 0,
      injection_level: 0,
      section_loss: 0,
      total_loss: 0,
      wavelength: '',
    },
  );
  const onSaveButtonClick = () => {
    request('SettingsUpdatethreshold_setting', {
      data: {threshold_setting: threshold_setting},
    });
  };

  const onResetButtonClick = () => {
    setThreshold_setting({
      event_loss: 0.1,
      event_reflectance: 1,
      injection_level: 1,
      section_loss: 0.1,
      total_loss: 1,
      wavelength: '1550',
    });
  };
  const buttons = (
    <>
      <SimpleBtn onClick={() => onSaveButtonClick()}>Save</SimpleBtn>
      <SimpleBtn onClick={() => onResetButtonClick()}>
        Reset to Default
      </SimpleBtn>
      <SimpleBtn link to="..">
        Cancel
      </SimpleBtn>
    </>
  );

  return (
    <FormLayout buttons={buttons}>
      <div className="flex flex-col gap-y-4">
        <Rowinput name="Wavelength">
          <Select
            value={threshold_setting.wavelength}
            onChange={e => {
              let old = {...threshold_setting};
              old.wavelength = e.target.value;
              setThreshold_setting(old);
            }}
            className="w-full">
            <option value="" className="hidden">
              Select
            </option>
            <option value={undefined} className="hidden">
              Select
            </option>
            <option>1310</option>
            <option>1490</option>
            <option>1550</option>
            <option>1625</option>
          </Select>
        </Rowinput>
        <Rowinput name="Total Loss (dB)">
          <TextInput
           min={0}
           max={40}
           step={0.01}
           defaultValue={SettingsGet?.data?.threshold_setting?.total_loss}
            onChange={e => {
              let old = {...threshold_setting};
              old.total_loss = Number(e.target.value);
              setThreshold_setting(old);
            }}
            type="number"
            className="w-full"
            // defaultValue={1}
          />
        </Rowinput>

        <Rowinput name="Section Loss (dB)">
          <TextInput
           min={0}
           max={40}
           step={0.01}
           defaultValue={SettingsGet?.data?.threshold_setting?.section_loss}
            onChange={e => {
              let old = {...threshold_setting};
              old.section_loss = Number(e.target.value);
              setThreshold_setting(old);
            }}
            type="number"
            className="w-full"
            // defaultValue={0.1}
          />
        </Rowinput>
        <Rowinput name="Event Loss (dB)">
          <TextInput
           min={0}
           max={9.99}
           step={0.1}
           defaultValue={SettingsGet?.data?.threshold_setting.event_loss}
            onChange={e => {
              let old = {...threshold_setting};
              old.event_loss = Number(e.target.value);
              setThreshold_setting(old);
            }}
            type="number"
            className="w-full"
         
          />
        </Rowinput>
        <Rowinput name="Event Reflectance (dB)">
          <TextInput
              min={-65}
              max={-14}
              step={0.1}
              defaultValue={SettingsGet?.data?.threshold_setting.event_reflectance}
            onChange={e => {
              let old = {...threshold_setting};
              old.event_reflectance = Number(e.target.value);
              setThreshold_setting(old);
            }}
            type="number"
            className="w-full"
          />
        </Rowinput>
        <Rowinput name="Injection Level (dB)">
          <TextInput
             min={0}
             step={0.01}
             defaultValue={SettingsGet?.data?.threshold_setting.injection_level}
            onChange={e => {
              let old = {...threshold_setting};
              old.injection_level = Number(e.target.value);
              setThreshold_setting(old);
            }}
            type="number"
            className="w-full"
          />
        </Rowinput>
      </div>
    </FormLayout>
  );
};

export default ThresholdSettingsPage;
