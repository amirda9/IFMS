import {FC} from 'react';
import {Description, Select, TextInput} from '~/components';

const TestDetailsLearning: FC = () => {
  return (
    <div className="flex flex-col gap-y-8">
      <Description labelClassName='basis-64' label="Targeted Count Per Cycle">
        <TextInput name="count-per-cycle" type="number" />
      </Description>

      <Description labelClassName='basis-64' label="Start a New Cycle">
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center">
            <input
              name="start-cycle"
              type="radio"
              value="on"
              defaultChecked={true}
              className="mr-2"
            />
            <label>On</label>
            <TextInput type="date" className="w-48 ml-6" />
          </div>
          <div className="flex flex-row items-center gap-x-4">
            <input
              name="start-cycle"
              type="radio"
              value="every"
              className="-mr-2"
            />
            <label>Every</label>
            <TextInput defaultValue={2} className="w-16" />
            <Select className='w-26' >
              <option>Months</option>
              <option>Days</option>
            </Select>
          </div>
        </div>
      </Description>

      <Description labelClassName='basis-64' label={<span className='flex items-center gap-x-2'><span>Increase Target by</span> <TextInput className='w-16' /></span>}>
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-row items-center">
            <input
              name="increase-target"
              type="radio"
              value="on"
              defaultChecked={true}
              className="mr-2"
            />
            <label>On</label>
            <TextInput type="date" className="w-48 ml-6" />
          </div>
          <div className="flex flex-row items-center gap-x-4">
            <input
              name="increase-target"
              type="radio"
              value="every"
              className="-mr-2"
            />
            <label>Every</label>
            <TextInput defaultValue={2} className="w-16" />
            <Select className='w-26' >
              <option>Months</option>
              <option>Days</option>
            </Select>
            <span>Up to Max.</span>
            <TextInput className='w-16' />
            <span>traces</span>
          </div>
        </div>
      </Description>
    </div>
  );
};

export default TestDetailsLearning;
