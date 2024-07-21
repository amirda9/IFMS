import {FC, Fragment, ReactNode, useEffect, useState} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Select, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {$Get} from '~/util/requestapi';
import { toast } from 'react-toastify';
type Rowinputtype = {
  name: string;
  children: ReactNode;
  display: string;
};

type monitoring_test_settingtype = {
  ior: number;
  rbs: number;
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
  step?: number;
  display: string;
};

const Rowinput = ({name, children, display}: Rowinputtype) => {
  return (
    <div className={`${display} w-[800px] flex-row justify-between`}>
      <span className="w-[400px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};

// ----------------- main ---------------- main ------------------- main ------------ main ----------------
const MonitoringTestPage: FC = () => {
  const {
    request,
    state,
  } = useHttpRequest({
    selector: state => ({
      SettingsGet: state.http.SettingsGet,
      SettingsUpdatemonitoring_test_setting:
        state.http.SettingsUpdatemonitoring_test_setting,
    }),
    initialRequests: request => {
      request('SettingsGet', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.SettingsUpdatemonitoring_test_setting?.httpRequestStatus ===
          'loading' &&
        state.SettingsUpdatemonitoring_test_setting!.httpRequestStatus ===
          'success'
      ) {
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
        request('SettingsGet', undefined);
      }
      if(state?.SettingsUpdatemonitoring_test_setting?.error){
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    },
  });

  const [inputs, setInputs] = useState<(SelectInputType | NumberInputType)[]>(
    [],
  );
  const [monitoring_test_setting, setMonitoring_test_setting] =
    useState<monitoring_test_settingtype>();

  const getdate = async () => {
    const getappsettings = await $Get(`otdr/settings/app-settings`);
    if (getappsettings?.status == 200) {
      const appsettings = await getappsettings?.json();
      setMonitoring_test_setting(appsettings?.monitoring_test_setting);
    }
  };

  useEffect(() => {
    const allinputs: (SelectInputType | NumberInputType)[] = [
      {
        display: 'flex',
        type: 'select',
        label: 'Test Mode',
        options: ['fast', 'precision'],
        defaultValue: 'fast',
        name: 'test_mode' as const,
      },
      {
        display: 'flex',
        type: 'select',
        label: 'Run Mode',
        options: ['average', 'realtime'],
        defaultValue: 'Average',
        name: 'run_mode' as const,
      },
      {
        display: 'flex',
        type: 'select',
        label: 'Distance Mode',
        options: ['manual', 'automatic'],
        defaultValue: 'manual',
        name: 'distance_mode' as const,
      },

      {
        display:
          monitoring_test_setting?.distance_mode == 'manual'
            ? 'flex'
            : 'hidden',
        type: 'select',
        label: 'Range (km)',
        options: [0.5, 2.5, 5, 15, 40, 80, 120, 160, 200],
        defaultValue: 3,
        name: 'range' as const,
      },
      {
        display: 'flex',
        type: 'select',
        label: 'Pulse Width Mode',
        options: ['manual', 'automatic'],
        defaultValue: 'Manual',
        name: 'pulse_width_mode' as const,
      },
      {
        display:
          monitoring_test_setting?.pulse_width_mode == 'manual'
            ? 'flex'
            : 'hidden',
        type: 'select',
        label: 'Pulse Width (ns)',
        options: [3, 5, 10, 30, 50, 100, 275, 500, 1000],
        defaultValue: 3,
        name: 'pulse_width' as const,
      },
      {
        display: 'flex',
        type: 'select',
        label: 'Sampling Mode',
        options: ['duration', 'automatic', 'repetition'],
        defaultValue: 'duration',
        name: 'sampling_mode' as const,
      },
      {
        minValue: 1,
        maxValue: 1999,
        display:
          monitoring_test_setting?.sampling_mode == 'automatic'
            ? 'hidden'
            : 'flex',
        type: 'number',
        label:
          monitoring_test_setting?.sampling_mode == 'repetition'
            ? 'Sampling Repetition (s)'
            : 'Sampling Duration (s)',
        defaultValue: 4,
        name: 'sampling_duration' as const,
      },
      {
        display: 'flex',
        minValue: 1.3,
        maxValue: 1.8,
        step: 0.000001,
        type: 'number',
        label: 'IOR',
        defaultValue: 1.476,
        precision: 6,
        name: 'ior' as const,
      },
      {
        display: 'flex',
        minValue: -90,
        maxValue: -40,
        step: 0.01,
        type: 'number',
        label: 'RBS (dB)',
        defaultValue: -79,
        precision: 6,
        name: 'rbs' as const,
      },
      {
        display: 'flex',
        minValue: 0,
        maxValue: 9.99,
        step: 0.01,
        type: 'number',
        label: 'Event Loss threshold (dB)',
        defaultValue: 0.05,
        precision: 6,
        name: 'event_loss_threshold' as const,
      },
      {
        display: 'flex',
        minValue: -65,
        maxValue: -14,
        step: 0.1,
        type: 'number',
        label: 'Event Reflection Threshold (dB)',
        defaultValue: -40,
        precision: 6,
        name: 'event_reflection_threshold' as const,
      },
      {
        display: 'flex',
        minValue: 0.01,
        maxValue: 9.99,
        step: 0.01,
        type: 'number',
        label: 'Fiber End Threshold (dB)',
        defaultValue: 5,
        precision: 6,
        name: 'fiber_end_threshold' as const,
      },
      // -------------
    ];
    setInputs(allinputs);
    getdate();
  }, []);

  const onSaveButtonClick = () => {
    request('SettingsUpdatemonitoring_test_setting', {
      data: {monitoring_test_setting: monitoring_test_setting!},
    });
  };

  const onResetButtonClick = () => {
    setMonitoring_test_setting({
      ior: 1.476,
      rbs: -79,
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

  if(state?.SettingsUpdatemonitoring_test_setting?.httpRequestStatus == "loading" || state?.SettingsGet?.httpRequestStatus == "loading"){
    return <h1>loading ...</h1>
  }
  return (
    <SystemSettingsMain
      onResetButtonClick={onResetButtonClick}
      onSaveButtonClick={onSaveButtonClick}
      contentClassName="w-4/5">
      {inputs.map((input: SelectInputType | NumberInputType, i) =>
        input.type === 'select' ? (
          <Rowinput key={i} name={input.label} display={input.display}>
            <Select
              value={
                monitoring_test_setting && monitoring_test_setting[input.name]
              }
              onChange={e => {
                let old: monitoring_test_settingtype = {
                  ...monitoring_test_setting!,
                };
                old[input.name] = e.target.value;
                setMonitoring_test_setting(old);
              }}
              className={`w-[350px]  flex-grow text-[20px] font-light leading-[24.2px] text-[#000000]`}>
              {input.options.map(opt => (
                <option key={'OPT__' + opt}>{opt}</option>
              ))}
            </Select>
          </Rowinput>
        ) : input.type === 'number' ? (
          <Rowinput key={i} name={input.label} display={input.display}>
            <TextInput
              step={input.step || 1}
              type="number"
              value={
                monitoring_test_setting && monitoring_test_setting[input.name]
              }
              onChange={e => {
                let old: monitoring_test_settingtype = {
                  ...monitoring_test_setting!,
                };
                old[input.name] = Number(e.target.value);
                setMonitoring_test_setting(old);
              }}
              className={`w-[350px] flex-grow text-[20px] font-light leading-[24.2px] text-[#000000]`}
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
};

export default MonitoringTestPage;
