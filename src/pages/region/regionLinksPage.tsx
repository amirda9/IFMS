import React from 'react';
import {SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[30%]', sort: true},
  source: {label: 'Source', size: 'w-[30%]'},
  destination: {label: 'Destination', size: 'w-[30%]'},
};
const dummy = [
  {index: 1, name: 'link1', source: 'Station1', destination: 'Station1'},
  {index: 2, name: 'link2', source: 'Station2', destination: 'Station2'},
  {index: 3, name: 'link3', source: 'Station3', destination: 'Station3'},
  {index: 4, name: 'link4', source: 'Station4', destination: 'Station4'},
  {index: 5, name: 'link5', source: 'Station5', destination: 'Station5'},
  {index: 6, name: 'link6', source: 'Station6', destination: 'Station6'},
];
const RegionLinksPage = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Table cols={columns} items={dummy} width="w-3/5" />
      </div>
      <div className="mr-4 flex flex-row gap-x-2 self-end">
        <SimpleBtn>Edit Links List</SimpleBtn>
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionLinksPage;
