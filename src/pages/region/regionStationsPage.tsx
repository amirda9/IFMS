import React, { useEffect, useState } from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import { BASE_URL } from '~/constant';
import { useSelector } from 'react-redux';
import { BsChevronDown } from 'react-icons/bs';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};

const RegionStationsPage = () => {
  const {regionDetail,networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    setuserrole(role.role);
  };
  useEffect(() => {
    getrole();
  }, []);
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
      <div className="relative h-5/6">
      <BsChevronDown className='absolute  left-[30.5%] z-20  top-[8px]' />
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
      {userrole == 'superuser' || networkDetail?.data?.access?.access == 'ADMIN' ||
      regionDetail?.data?.access.access == 'ADMIN' ?
        <SimpleBtn link to="/stations">
          Edit Stations List
        </SimpleBtn>:null}
        {userrole == 'superuser' || networkDetail?.data?.access?.access == 'ADMIN' ||
      regionDetail?.data?.access.access == 'ADMIN' ?
        <SimpleBtn>Save</SimpleBtn>:null}
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionStationsPage;
