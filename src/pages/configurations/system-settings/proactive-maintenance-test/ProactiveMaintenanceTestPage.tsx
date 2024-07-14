import {FC, Fragment, ReactNode, useEffect, useState} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Select, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {$Get} from '~/util/requestapi';
import {deepcopy} from '~/util';

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
  step?: number;
};

type maintenance_test_settingtype = {
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

const Rowinput = ({name, children, display}: Rowinputtype) => {
  return (
    <div className={`${display} mt-2 w-[800px] flex-row justify-between`}>
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
  const [inputs, setInputs] = useState<(SelectInputType | NumberInputType)[]>(
    [],
  );
  const [maintenance_test_setting, setmaintenance_test_setting] =
    useState<maintenance_test_settingtype>();


  const getAppsettingsdata = async () => {
    const getappsettings = await $Get(`otdr/settings/app-settings`);
    if (getappsettings?.status == 200) {
      let getappsettingsdata = await getappsettings?.json();
      setmaintenance_test_setting(getappsettingsdata?.maintenance_test_setting);
    }
  };

  useEffect(() => {
    const inputsdata: (SelectInputType | NumberInputType)[] = [
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
          maintenance_test_setting?.distance_mode == 'manual'
            ? 'flex'
            : 'hidden',
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
          maintenance_test_setting?.pulse_width_mode == 'manual'
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
          maintenance_test_setting?.sampling_mode == 'automatic'
            ? 'hidden'
            : 'flex',
        type: 'number',
        label:
          maintenance_test_setting?.sampling_mode == 'repetition'
            ? 'Sampling Repetition (s)'
            : 'Sampling Duration (s)',
        defaultValue: 4,
        name: 'sampling_duration',
      },
      {
        display: 'flex',
        type: 'number',
        label: 'IOR',
        defaultValue: 1.54321,
        name: 'ior',
        step: 0.000001,
      },
      {
        display: 'flex',
        type: 'number',
        label: 'RBS (dB)',
        defaultValue: -79,
        name: 'rbs',
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
    setInputs(inputsdata);
    getAppsettingsdata();
  }, []);

  const onSaveButtonClick = () => {
    let data = deepcopy(maintenance_test_setting);
    if (maintenance_test_setting?.distance_mode != 'manual') {
      delete data.range;
    }
    if (maintenance_test_setting?.pulse_width_mode != 'manual') {
      delete data.pulse_width;
    }
    if (maintenance_test_setting?.sampling_mode == 'automatic') {
      delete data.sampling_duration;
    }
    request('SettingsUpdatesetmaintenance_test_setting', {
      data: {maintenance_test_setting: data},
    });
  };

  const onResetButtonClick = () => {
    setmaintenance_test_setting({
      ior: 1.54321,
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

  return (
    <SystemSettingsMain
      onResetButtonClick={onResetButtonClick}
      onSaveButtonClick={onSaveButtonClick}
      contentClassName="w-2/5">
      {inputs.map((input, i) =>
        input.type === 'select' ? (
          <Rowinput key={i} name={input.label} display={input.display}>
            <Select
              value={
                maintenance_test_setting && maintenance_test_setting[input.name]
              }
              onChange={e => {
                let old = {...maintenance_test_setting!};
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
          <Rowinput key={i} name={input.label} display={input.display}>
            <TextInput
              type="number"
              step={input.step || 1}
              value={
                maintenance_test_setting && maintenance_test_setting[input.name]
              }
              onChange={e => {
                let old = {...maintenance_test_setting!};
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
