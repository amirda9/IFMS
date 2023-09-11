import {FC} from 'react';
import {Description, TextInput} from '~/components';

const times = {
  Hourly: 'Hour(s)',
  Daily: 'Day(s)',
  Monthly: 'Month(s)',
  Yearly: 'Year(s)',
  Every: '',
};

const TestDetailsTestProgram: FC = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <Description label="Starting Date">
        <div className="flex items-center gap-x-8">
          <TextInput type="date" />
          <TextInput type="time" />
          <span>
            <input type="radio" />
            <label className="ml-2">As Soon As Possible</label>
          </span>
        </div>
      </Description>
      <Description label="Starting Date">
        <div className="flex items-center gap-x-8">
          <TextInput type="date" />
          <TextInput type="time" />
          <span>
            <input type="radio" />
            <label className="ml-2">Indefinite</label>
          </span>
        </div>
      </Description>
      <Description label="Periodicity">
        <div className="flex flex-col gap-y-4">
          <label className="flex items-center">
            <input type="radio" name="periodicity" defaultChecked />
            <span className="ml-2">Hourly</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="periodicity" />
            <span className="ml-2">Daily</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="periodicity" />
            <span className="ml-2">Monthly</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="periodicity" />
            <span className="ml-2">Yearly</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="periodicity" />
            <span className="ml-2">Every</span>
          </label>
        </div>
        <div className='ml-16'>
          <span>Every</span>
          <TextInput type="number" className='w-16 mx-4' />
          <span>Hour(s)</span>
        </div>
      </Description>
    </div>
  );
};

export default TestDetailsTestProgram;
