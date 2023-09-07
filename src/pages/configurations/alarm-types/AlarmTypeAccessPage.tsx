import {FC} from 'react';
import {Description, SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]'},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const items = [
  {index: 1, user: 'User1', region: 'Region1', station: 'Station1'},
  {index: 2, user: 'User2', region: 'Region2', station: 'Station2'},
  {index: 3, user: 'User3', region: 'Region3', station: 'Station3'},
  {index: 4, user: 'User4', region: 'Region4', station: 'Station4'},
  {index: 5, user: 'User5', region: 'Region5', station: 'Station5'},
];

const AlarmTypeAccessPage: FC = () => {
  return (
    <div className="flex flex-grow flex-col gap-y-12">
      <div className="flex w-3/5 flex-grow flex-col gap-y-8">
        <Description label="Link Viewer(s)" items="start" className="flex-grow">
          <Table
            cols={columns}
            items={items}
            containerClassName="flex-grow h-full"
          />
        </Description>
      </div>

      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn type="submit">Edit Access</SimpleBtn>
        <SimpleBtn type="submit">Save</SimpleBtn>
        <SimpleBtn link to="../">
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default AlarmTypeAccessPage;
