import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import AlarmCheckboxList from './AlarmCheckboxList';

const item = [{
  label: 'Fault',
  items: [
    {
      label: 'Admin',
    },
    {
      label: 'Network Admin',
    },
    {
      label: 'Network Viewer',
    },
    {
      label: 'Region Admin',
    },
    {
      label: 'Region Viewer',
    },
    {
      label: 'Station Admin',
    },
    {
      label: 'Station Viewer',
    },
  ]
}

];

const aboutoptions=[{label: 'Pending'},{label: 'Acknowledged'},{label: 'In progress'},{label: 'Resolved'}]
const AlarmTypeAlertPage: FC = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex flex-grow flex-col gap-y-8">
        <Description label="Send Alert about">
          <ControlledSelect
            className='w-1/4'
            onChange={() => {}}
            options={aboutoptions}
          />
        </Description>
        <div className='w-1/4'>
          <AlarmCheckboxList type="sending" items={item} />
        </div>
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn type="submit">Save</SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeAlertPage;
