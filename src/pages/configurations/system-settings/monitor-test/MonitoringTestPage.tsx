import {FC, Fragment, ReactNode, useState} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Description, Select, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
type Rowinputtype = {
  name: string;
  children: ReactNode;
};

type monitoring_test_settingtype={
    IOR: number,
    RBS: number,
    distance_mode:string,
    event_loss_threshold:number,
    event_reflection_threshold: number,
    fiber_end_threshold: number,
    pulse_width: number,
    pulse_width_mode: string,
    range: number,
    run_mode:string,
    sampling_duration: number,
    sampling_mode:string,
    test_mode:string,
    [index:string]:any
}


type SelectInputType = {
  type: 'select';
  label: string;
  options: string[] | number[];
  defaultValue: number | string;
  name:string
};

type NumberInputType = {
  type: 'number';
  label: string;
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
  precision?: number;
  name:string
};



const Rowinput = ({name, children}: Rowinputtype) => {
  return (
    <div className="flex w-[800px] flex-row justify-between">
      <span className="w-[400px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {name}
      </span>
      <div className="flex w-[350px]">{children}</div>
    </div>
  );
};

const inputs: (SelectInputType | NumberInputType)[] = [
  {
    type: 'select',
    label: 'Test Mode',
    options: ['fast','precision'],
    defaultValue: 'fast',
    name:'test_mode' as const
  },
  {
    type: 'select',
    label: 'Run Mode',
    options: ['average','realtime'],
    defaultValue: 'Average',
    name:'run_mode' as const
  },
  {
    type: 'select',
    label: 'Distance Mode',
    options: ['manual','automatic'],
    defaultValue: 'manual',
    name:'distance_mode' as const
  },

  {
    type: 'select',
    label: 'Range (km)',
    options: [3],
    defaultValue: 3,
    name:'range' as const
  },
  {
    type: 'select',
    label: 'Pulse Width Mode',
    options: ['manual','automatic'],
    defaultValue: 'Manual',
    name:'pulse_width_mode' as const
  },
  {
    type: 'select',
    label: 'Pulse Width (ns)',
    options: [3],
    defaultValue: 3,
    name:'pulse_width' as const
  },
  {
    type: 'select',
    label: 'Sampling Mode',
    options: ['duration','automatic','repetition'],
    defaultValue: 'duration',
    name:'sampling_mode' as const
  },
  {
    type: 'number',
    label: 'Sampling Duration (s)',
    defaultValue: 4,
    name:'sampling_duration' as const
  },
  {
    type: 'number',
    label: 'IOR',
    defaultValue: 1.476,
    precision: 6, 
    name:'IOR' as const
  },
  {
    type: 'number',
    label: 'RBS (dB)',
    defaultValue: -79,
    precision: 6,
    name:'RBS' as const
  },
  {
    type: 'number',
    label: 'Event Loss threshold (dB)',
    defaultValue:0.05,
    precision: 6,
    name:'event_loss_threshold' as const
  },
  {
    type: 'number',
    label: 'Event Reflection Threshold (dB)',
    defaultValue: -40,
    precision: 6,
    name:'event_reflection_threshold' as const
  },
  {
    type: 'number',
    label: 'Fiber End Threshold (dB)',
    defaultValue: 5,
    precision: 6,
    name:'fiber_end_threshold' as const
  },
  // -------------
];
// ----------------- main ---------------- main ------------------- main ------------ main ----------------
const MonitoringTestPage: FC = () => {
  const {
    request,
    state: {SettingsGet, SettingsUpdatemonitoring_test_setting},
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
        state.SettingsUpdatemonitoring_test_setting!.httpRequestStatus === 'success'
      ) {
        request('SettingsGet', undefined);
      }
    },
  });

  const [monitoring_test_setting, setMonitoring_test_setting] = useState<monitoring_test_settingtype>(
    SettingsGet?.data?.monitoring_test_setting || {
      IOR: 0,
      RBS:0,
      distance_mode: '',
      event_loss_threshold: 0,
      event_reflection_threshold: 0,
      fiber_end_threshold: 0,
      pulse_width:0 ,
      pulse_width_mode: '',
      range: 0,
      run_mode: '',
      sampling_duration: 0,
      sampling_mode: '',
      test_mode: '',
    },
  );
  console.log(monitoring_test_setting, 'monitoring_test_setting');

  const onSaveButtonClick = () => {
    request('SettingsUpdatemonitoring_test_setting', {
      data: {monitoring_test_setting: monitoring_test_setting},
    });
  };

  const onResetButtonClick = () => {
    setMonitoring_test_setting({
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
    })
  };



  return (
    <SystemSettingsMain onResetButtonClick={onResetButtonClick}  onSaveButtonClick={onSaveButtonClick}  contentClassName="w-4/5">
   
      {inputs.map((input:SelectInputType | NumberInputType, i) =>
        input.type === 'select' ? (
          <Rowinput name={input.label}>
            <Select value={monitoring_test_setting && monitoring_test_setting[input.name]} onChange={(e)=> {
              let old:any={...monitoring_test_setting}
              old[input.name]=e.target.value
              setMonitoring_test_setting(old)}} className="w-[350px] flex-grow text-[20px] font-light leading-[24.2px] text-[#000000]">
              {input.options.map(opt => (
                <option key={'OPT__' + opt}>{opt}</option>
              ))}
            </Select>
          </Rowinput>
        ) : input.type === 'number' ? (
          <Rowinput name={input.label}>
            <TextInput
            type='number'
            value={monitoring_test_setting && monitoring_test_setting[input.name] || ""} onChange={(e)=> {
              let old:any={...monitoring_test_setting}
              old[input.name]=Number(e.target.value)
              setMonitoring_test_setting(old)}}
              className="w-[350px] flex-grow text-[20px] font-light leading-[24.2px] text-[#000000]"
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
};

export default MonitoringTestPage;
