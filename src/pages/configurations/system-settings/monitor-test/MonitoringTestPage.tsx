import {FC, Fragment} from 'react';
import SystemSettingsMain from '../SystemSettingsMain';
import {Description, Select, TextInput} from '~/components';

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
    label: 'Wavelength (nm)',
    options: [1625],
    defaultValue: 1625,
  },
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
    label: 'Refraction',
    defaultValue: 1.476,
    precision: 6,
  },
  {
    type: 'number',
    label: 'Scattering Coefficient',
    defaultValue: -79.0,
    precision: 2,
  },
  {
    type: 'number',
    label: 'Reflection Event Threshold',
    defaultValue: -40.0,
    precision: 1,
  },
  {
    type: 'number',
    label: 'Fiber End Threshold',
    defaultValue: 5.0,
    precision: 2,
  },
  {
    type: 'number',
    label: 'Connection Loss Threshold',
    defaultValue: 0.05,
    precision: 2,
  },
  {
    type: 'select',
    label: 'Fault Threshold Settings',
    options: ['Normal'],
    defaultValue: 'Normal',
  },
  {
    type: 'number',
    label: 'Targeted Learning Count',
    defaultValue: 1,
  },
  {
    type: 'select',
    label: 'Reset Learning',
    options: ['Yes'],
    defaultValue: 'Yes',
  },
  {
    type: 'number',
    label: 'Reset Frequency',
    defaultValue: 1,
  },
  {
    type: 'select',
    label: 'Reset Frequency',
    options: ['Days'],
    defaultValue: 'Days',
  },
  {
    type: 'select',
    label: 'Expand Learning',
    options: ['Yes'],
    defaultValue: 'Yes',
  },
  {
    type: 'number',
    label: 'Expand Frequency',
    defaultValue: 14,
  },
  {
    type: 'select',
    label: 'Expand Periodicity',
    options: ['Days'],
    defaultValue: 'Days',
  },
  {
    type: 'number',
    label: 'Expand Step',
    defaultValue: 1,
  },
  {
    type: 'number',
    label: 'Expand Learning to Max. # trace(s)',
    defaultValue: 54,
  },
  {
    type: 'select',
    label: 'Expand Mode (Peak Monitoring)',
    options: ['No'],
    defaultValue: 'No',
  },
];

const MonitoringTestPage: FC = () => {
  return (
    <SystemSettingsMain contentClassName='w-2/5'>
      {inputs.map((input, i) =>
        input.type === 'select' ? (
          <Description
            key={input.type + '__' + input.label}
            labelClassName="w-[18rem]"
            label={input.label}>
            <Select className="flex-grow">
              {input.options.map(opt => (
                <option key={'OPT__' + opt}>{opt}</option>
              ))}
            </Select>
          </Description>
        ) : input.type === 'number' ? (
          <Description
            key={input.type + '__' + input.label}
            labelClassName="w-[18rem]"
            label={input.label}>
            <TextInput
              className="flex-grow"
              max={input.maxValue}
              min={input.minValue}
              defaultValue={input.defaultValue.toFixed(input.precision)}
            />
          </Description>
        ) : (
          <Fragment key={'FRAG__' + i} />
        ),
      )}
    </SystemSettingsMain>
  );
};

export default MonitoringTestPage;
