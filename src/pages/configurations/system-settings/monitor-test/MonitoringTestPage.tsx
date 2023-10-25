import {FC, Fragment, ReactNode} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Description, Select, TextInput} from '~/components';
type Rowinputtype = {
  name: string;
  children: ReactNode;
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


type SelectInputType = {
  type: 'select';
  label: string;
  options: string[] | number[];
  defaultValue: number | string;
};

type NumberInputType = {
  type: 'number';
  label: string;
  minValue?: number;
  maxValue?: number;
  defaultValue: number;
  precision?: number;
};

const inputs: (SelectInputType | NumberInputType)[] = [
  {
    type: 'select',
    label: 'Test Mode',
    options: ['Fast'],
    defaultValue: 'Fast',
  },
  {
    type: 'select',
    label: 'Run Mode',
    options: ['Average'],
    defaultValue: 'Average',
  },
  {
    type: 'select',
    label: 'Distance Mode',
    options: ['Manual'],
    defaultValue: 'Manual',
  },

  {
    type: 'select',
    label: 'Range (km)',
    options: [3],
    defaultValue: 3,
  },
  {
    type: 'select',
    label: 'Pulse Width Mode',
    options: ['Manual'],
    defaultValue: 'Manual',
  },
  {
    type: 'select',
    label: 'Pulse Width (ns)',
    options: [3],
    defaultValue: 3,
  },
  {
    type: 'select',
    label: 'Sampling Mode',
    options: ['Duration'],
    defaultValue: 'Duration',
  },
  {
    type: 'number',
    label: 'Sampling Duration (s)',
    defaultValue: 4,
  },
  {
    type: 'number',
    label: 'IOR',
    defaultValue: 1.476,
    precision: 6,
  },
  {
    type: 'number',
    label: 'RBS (dB)',
    defaultValue: 1.476,
    precision: 6,
  },
  {
    type: 'number',
    label: 'Event Loss threshold (dB)',
    defaultValue: 1.476,
    precision: 6,
  },
  {
    type: 'number',
    label: 'Event Reflection Threshold (dB)',
    defaultValue: 1.476,
    precision: 6,
  },
  {
    type: 'number',
    label: 'Fiber End Threshold (dB)',
    defaultValue: 1.476,
    precision: 6,
  },
  // -------------
];

const MonitoringTestPage: FC = () => {
  return (
    <SystemSettingsMain contentClassName="w-4/5">
      {inputs.map((input, i) =>
        input.type === 'select' ? (
          <Rowinput name={input.label}>
            <Select className="w-[350px] flex-grow">
              {input.options.map(opt => (
                <option key={'OPT__' + opt}>{opt}</option>
              ))}
            </Select>
          </Rowinput>
        ) : input.type === 'number' ? (
          <Rowinput name={input.label}>
            <TextInput
              className="w-[350px] flex-grow"
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
