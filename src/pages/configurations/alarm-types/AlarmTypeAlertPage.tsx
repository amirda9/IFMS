import {FC} from 'react';
import {ControlledSelect, Description, SimpleBtn} from '~/components';
import AlarmCheckboxList from './AlarmCheckboxList';

const item = [
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
];

const AlarmTypeAlertPage: FC = () => {
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex flex-grow flex-col gap-y-8">
        <Description label="Send Alert about">
          <ControlledSelect
            className='w-1/4'
            onChange={() => {}}
            options={[{label: 'New (Pending)'}]}
          />
        </Description>
        <div className='w-1/4'>
          <AlarmCheckboxList items={item} />
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
