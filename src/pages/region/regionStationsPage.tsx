import React from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};

const RegionStationsPage = () => {
  const params = useParams<{regionId: string}>();
  const {state} = useHttpRequest({
    selector: state => ({list: state.http.regionStationList}),
    initialRequests: request => {
      request('regionStationList', {params: {region_id: params.regionId!}});
    },
  });
  console.log(state?.list?.data,'state.list');
  
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Table
          cols={columns}
          items={
            state.list?.data?.map(station => ({
              name: station.name,
              latitude: station.longitude,
              longitude:station.latitude,
            })) || []
          }
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index + 1}
          containerClassName="w-3/5"
        />
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="/stations">
          Edit Stations List
        </SimpleBtn>
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionStationsPage;
