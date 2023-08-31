import React from 'react';
import {Description, Select, SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
const dummy = [
  {index: 1, user: 'USER1', region: 'Region', station: 'Station'},
  {index: 2, user: 'USER2', region: 'Region', station: 'Station'},
  {index: 3, user: 'USER3', region: 'Region', station: 'Station'},
  {index: 4, user: 'USER4', region: 'Region', station: 'Station'},
  {index: 5, user: 'USER5', region: 'Region', station: 'Station'},
  {index: 6, user: 'USER6', region: 'Region', station: 'Station'},
];
const LinkAccessPage = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Description label="Link Admin" className="mb-4">
          <Select className="w-80">
            <option>ahmad kazemi</option>
          </Select>
        </Description>
        <Description label="Link Viewers(s)" items="start" className="h-full">
          <Table cols={columns} items={dummy} containerClassName="w-3/5" />
        </Description>
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="../edit-access">
          Edit Station Viewer(s)
        </SimpleBtn>
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkAccessPage;
