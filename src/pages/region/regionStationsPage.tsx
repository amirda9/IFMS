import React from 'react';
import {SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};
const dummy = [
  {index: 1, name: 'Station1', latitude: '35.1', longitude: '51.1'},
  {index: 2, name: 'Station2', latitude: '35.2', longitude: '51.2'},
  {index: 3, name: 'Station3', latitude: '35.3', longitude: '51.3'},
  {index: 4, name: 'Station4', latitude: '35.4', longitude: '51.4'},
  {index: 5, name: 'Station5', latitude: '35.5', longitude: '51.5'},
  {index: 6, name: 'Station6', latitude: '35.6', longitude: '51.6'},
];
const RegionStationsPage = () => {
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Table cols={columns} items={dummy} width="w-3/5" />
      </div>
      <div className="mr-4 flex flex-row gap-x-2 self-end">
        <SimpleBtn >
          Edit Stations List
        </SimpleBtn>
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionStationsPage;
