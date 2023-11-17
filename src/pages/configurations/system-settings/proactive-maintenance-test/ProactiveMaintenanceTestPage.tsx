import {FC, Fragment, ReactNode, useEffect, useState} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Description, Select, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {$GET} from '~/util/requestapi';

type Rowinputtype = {
  name: string;
  children: ReactNode;
  display: string;
};

type SelectInputType = {
  type: 'select';
  label: string;
  options: string[] | number[];
  defaultValue: number | string;
  name: string;
  display: string;
};

type NumberInputType = {
  type: 'number';
  label: string;
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
  precision?: number;
  name: string;
  display: string;
};

type maintenance_test_settingtype = {
  IOR: number;
  RBS: number;
  distance_mode: string;
  event_loss_threshold: number;
  event_reflection_threshold: number;
  fiber_end_threshold: number;
  pulse_width: number;
  pulse_width_mode: string;
  range: number;
  run_mode: string;
  sampling_duration: number;
  sampling_mode: string;
  test_mode: string;
  [index: string]: any;
};

const Rowinput = ({name, children, display}: Rowinputtype) => {
  return (
    <div className={`${display} w-[800px] flex-row justify-between`}>
      <span className="w-[320px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};
// ------------ main ------------------------ main --------------------------- main ------------------------- main -----------------------main -----
function ProactiveMaintenanceTestPage() {
  const {
    request,
    state: {SettingsGet, SettingsUpdatesetmaintenance_test_setting},
  } = useHttpRequest({
    selector: state => ({
      SettingsGet: state.http.SettingsGet,
      SettingsUpdatesetmaintenance_test_setting:
        state.http.SettingsUpdatesetmaintenance_test_setting,
    }),
    initialRequests: request => {
      request('SettingsGet', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.SettingsUpdatesetmaintenance_test_setting
          ?.httpRequestStatus === 'loading' &&
        state.SettingsUpdatesetmaintenance_test_setting!.httpRequestStatus ===
          'success'
      ) {
        request('SettingsGet', undefined);
      }
    },
  });

  const [maintenance_test_setting, setmaintenance_test_setting] =
    useState<maintenance_test_settingtype>(
      SettingsGet?.data?.maintenance_test_setting || {
        IOR: 0,
        RBS: 0,
        distance_mode: '',
        event_loss_threshold: 0,
        event_reflection_threshold: 0,
        fiber_end_threshold: 0,
        pulse_width: 0,
        pulse_width_mode: '',
        range: 0,
        run_mode: '',
        sampling_duration: 4,
        sampling_mode: '',
        test_mode: '',
      },
    );
  const getdate = async () => {
    const getdata = await $GET(`otdr/settings/app-settings`);
    console.log(getdata, 'getdatagetdata');

    setmaintenance_test_setting(getdata?.maintenance_test_setting);
  };

  useEffect(() => {
    getdate();
  }, []);

  const onSaveButtonClick = () => {
    let data: any = JSON.parse(JSON.stringify(maintenance_test_setting));
    if (maintenance_test_setting.distance_mode != 'manual') {
      delete data.range;
    }
    if (maintenance_test_setting.pulse_width_mode != 'manual') {
      delete data.pulse_width;
    }
    if (maintenance_test_setting.sampling_mode == 'automatic') {
      delete data.sampling_duration;
    }
    request('SettingsUpdatesetmaintenance_test_setting', {
      data: {maintenance_test_setting: data},
    });
  };

  const onResetButtonClick = () => {
    setmaintenance_test_setting({
      IOR: 1.476,
      RBS: -79,
      distance_mode: 'manual',
      event_loss_threshold: 0.05,
      event_reflection_threshold: -40,
      fiber_end_threshold: 5,
      pulse_width: 3,
      pulse_width_mode: 'manual',
      range: 3,
      run_mode: 'average',
      sampling_duration: 4,
      sampling_mode: 'duration',
      test_mode: 'fast',
    });
  };
  const inputs: (SelectInputType | NumberInputType)[] = [
    {
      display: 'flex',
      type: 'select',
      label: 'Test Mode',
      options: ['fast', 'precision'],
      defaultValue: 'fast',
      name: 'test_mode',
    },
    {
      display: 'flex',
      type: 'select',
      label: 'Run Mode',
      options: ['average', 'realtime'],
      defaultValue: 'Average',
      name: 'run_mode',
    },
    {
      display: 'flex',
      type: 'select',
      label: 'Distance Mode',
      options: ['manual', 'automatic'],
      defaultValue: 'manual',
      name: 'distance_mode',
    },
    {
      display:
        maintenance_test_setting.distance_mode == 'manual' ? 'flex' : 'hidden',
      type: 'select',
      label: 'Range (km)',
      options: [0.5, 2.5, 5, 15, 40, 80, 120, 160, 200],
      defaultValue: 3,
      name: 'range',
    },
    {
      display: 'flex',
      type: 'select',
      label: 'Pulse Width Mode',
      options: ['manual', 'automatic'],
      defaultValue: 'Manual',
      name: 'pulse_width_mode',
    },
    {
      display:
        maintenance_test_setting.pulse_width_mode == 'manual'
          ? 'flex'
          : 'hidden',
      type: 'select',
      label: 'Pulse Width (ns)',
      options: [3, 5, 10, 30, 50, 100, 275, 500, 1000],
      defaultValue: 3,
      name: 'pulse_width',
    },
    {
      display: 'flex',
      type: 'select',
      label: 'Sampling Mode',
      options: ['duration', 'automatic', 'repetition'],
      defaultValue: 'Duration',
      name: 'sampling_mode',
    },
    {
      display:
        maintenance_test_setting.sampling_mode == 'automatic'
          ? 'hidden'
          : 'flex',
      type: 'number',
      label:
        maintenance_test_setting.sampling_mode == 'repetition'
          ? 'Sampling Repetition (s)'
          : 'Sampling Duration (s)',
      defaultValue: 4,
      name: 'sampling_duration',
    },
    {
      display: 'flex',
      type: 'number',
      label: 'IOR',
      defaultValue: 1.476,
      name: 'IOR',
    },
    {
      display: 'flex',
      type: 'number',
      label: 'RBS (dB)',
      defaultValue: -79,
      name: 'RBS',
    },
    {
      display: 'flex',
      type: 'number',
      label: 'Event Loss threshold (dB)',
      defaultValue: 0.05,
      name: 'event_loss_threshold',
    },
    {
      display: 'flex',
      type: 'number',
      label: 'Event Reflection Threshold (dB)',
      defaultValue: -40,
      name: 'event_reflection_threshold',
    },
    {
      display: 'flex',
      type: 'number',
      label: 'Fiber End Threshold (dB)',
      defaultValue: 5,
      name: 'fiber_end_threshold',
    },
  ];

  return (
    <SystemSettingsMain
      onResetButtonClick={onResetButtonClick}
      onSaveButtonClick={onSaveButtonClick}
      contentClassName="w-2/5">
      {inputs.map((input, i) =>
        input.type === 'select' ? (
          <Rowinput name={input.label} display={input.display}>
            <Select
              value={maintenance_test_setting[input.name]}
              onChange={e => {
                let old = {...maintenance_test_setting};
                old[input.name] = e.target.value;
                setmaintenance_test_setting(old);
              }}
              className="w-[350px] flex-grow text-[20px] font-light leading-[24.2px] text-[#000000]">
              {input.options.map(opt => (
                <option key={'OPT__' + opt}>{opt}</option>
              ))}
            </Select>
          </Rowinput>
        ) : input.type === 'number' ? (
          <Rowinput name={input.label} display={input.display}>
            <TextInput
              type="number"
              value={maintenance_test_setting[input.name]}
              onChange={e => {
                let old = {...maintenance_test_setting};
                old[input.name] = Number(e.target.value);
                setmaintenance_test_setting(old);
              }}
              className="flex-grow"
              max={input.maxValue}
              min={input.minValue}
            />
          </Rowinput>
        ) : (
          <Fragment key={'FRAG__' + i} />
        ),
      )}
    </SystemSettingsMain>
  );
}

export default ProactiveMaintenanceTestPage;
