import {FC, Fragment, ReactNode, useState} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Description, Select, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';

type Rowinputtype = {
  name: string;
  children: ReactNode;
};

type SelectInputType = {
  type: 'select';
  label: string;
  options: string[] | number[];
  defaultValue: number | string;
  name: string;
};

type NumberInputType = {
  type: 'number';
  label: string;
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
  precision?: number;
  name: string;
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

const inputs: (SelectInputType | NumberInputType)[] = [
  {
    type: 'select',
    label: 'Test Mode',
    options: ['fast', 'precision'],
    defaultValue: 'fast',
    name: 'test_mode',
  },
  {
    type: 'select',
    label: 'Run Mode',
    options: ['average', 'realtime'],
    defaultValue: 'Average',
    name: 'run_mode',
  },
  {
    type: 'select',
    label: 'Distance Mode',
    options: ['manual', 'automatic'],
    defaultValue: 'manual',
    name: 'distance_mode',
  },
  {
    type: 'select',
    label: 'Range (km)',
    options: [3],
    defaultValue: 3,
    name: 'range',
  },
  {
    type: 'select',
    label: 'Pulse Width Mode',
    options: ['manual', 'automatic'],
    defaultValue: 'Manual',
    name: 'pulse_width_mode',
  },
  {
    type: 'select',
    label: 'Pulse Width (ns)',
    options: [3],
    defaultValue: 3,
    name: 'pulse_width',
  },
  {
    type: 'select',
    label: 'Sampling Mode',
    options: ['Duration'],
    defaultValue: 'Duration',
    name: 'sampling_mode',
  },
  {
    type: 'number',
    label: 'Sampling Duration (s)',
    defaultValue: 4,
    name: 'sampling_duration',
  },
  {
    type: 'number',
    label: 'IOR',
    defaultValue: 1.476,
    name: 'IOR',
  },
  {
    type: 'number',
    label: 'RBS (dB)',
    defaultValue: -79,
    name: 'RBS',
  },
  {
    type: 'number',
    label: 'Event Loss threshold (dB)',
    defaultValue: 0.05,
    name: 'event_loss_threshold',
  },
  {
    type: 'number',
    label: 'Event Reflection Threshold (dB)',
    defaultValue: -40,
    name: 'event_reflection_threshold',
  },
  {
    type: 'number',
    label: 'Fiber End Threshold (dB)',
    defaultValue: 5,
    name: 'fiber_end_threshold',
  },
];

const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="flex w-[800px] flex-row justify-between">
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
        lastState.SettingsUpdatesetmaintenance_test_setting?.httpRequestStatus ===
          'loading' &&
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

  const onSaveButtonClick = () => {
    request('SettingsUpdatesetmaintenance_test_setting', {
      data: {maintenance_test_setting: maintenance_test_setting},
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

  return (
    <SystemSettingsMain
      onResetButtonClick={onResetButtonClick}
      onSaveButtonClick={onSaveButtonClick}
      contentClassName="w-2/5">
      {inputs.map((input, i) =>
        input.type === 'select' ? (
          <Rowinput name={input.label}>
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
          <Rowinput name={input.label}>
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
              defaultValue={input.defaultValue.toFixed(input.precision)}
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
