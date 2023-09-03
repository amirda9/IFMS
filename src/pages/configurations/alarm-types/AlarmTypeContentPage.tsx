import {FC} from 'react';
import {SimpleBtn} from '~/components';
import AlarmContentBox from './AlarmContentBox';

const items = [
  {
    label: 'Fault',
    items: [
      {
        label: 'Affected Customers',
      },
      {
        label: 'Applied Threshold',
      },
      {
        label: 'Distance from Nearest Site',
      },
      {
        label: 'Last Confirmation Time',
      },
      {
        label: 'Loss',
      },
      {
        label: 'Maximum Position',
      },
      {
        label: 'Neatest Site',
      },
      {
        label: 'Position',
      },
      {
        label: 'Status',
      },
      {
        label: 'Threshold Type',
      },
      {
        label: 'Threshold Value',
      },
    ],
  },
];

const AlarmTypeContentPage: FC = () => {
  return (
    <div className="flex flex-grow flex-col">
      <div className="flex flex-grow gap-x-8">
        <AlarmContentBox title="Primary Source" items={items} />
        <AlarmContentBox
          title="Group By Secondary Source"
          items={items}
          titleCheckbox
        />
        <AlarmContentBox title="Alarm Details" items={items} />
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

export default AlarmTypeContentPage;
