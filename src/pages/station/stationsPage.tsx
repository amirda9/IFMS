import React, {useEffect, useState} from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useHttpRequest} from '~/hooks';
import {useSelector} from 'react-redux';
import {BASE_URL} from './../../constant';
import NetworktreeLayout from '~/layout/networktreeLayout';
const StationsPage = () => {
  const {stationDetail, networkDetail} = useSelector(
    (state: any) => state.http,
  );
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
    console.log(role, 'getrole');
  };
  useEffect(() => {
    getrole();
  }, []);
  const networkId = Cookies.get(networkExplored);
  const {
    state: {stations, deleteRequest},
    request,
  } = useHttpRequest({
    selector: state => ({
      stations: state.http.allStations,
      networkstations: state.http.networkstations,
      deleteRequest: state.http.stationDelete,
    }),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
        request('networkstations', {params: {network_id: networkId}});
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.deleteRequest?.httpRequestStatus === 'loading' &&
        state.deleteRequest!.httpRequestStatus === 'success'
      ) {
        request('allStations', undefined);
      }
    },
  });

  // console.log(networkstations,'networkstations');

  return (
    <NetworktreeLayout
      // searchOnChange={() => {}}
      // createTitle="Stations"
      // canAdd={
      //   userrole == 'superuser' ||
      //   networkDetail?.data?.access?.access == 'ADMIN'
      //     ? true
      //     : false
      // }
      >
      {/* {stations?.data?.map(value => (
        <SidebarItem
          onDelete={
            userrole == 'superuser' ||
            networkDetail?.data?.access?.access == 'ADMIN'
              ? () => request('stationDelete', {params: {station_id: value.id}})
              : () => {}
          }
          name={value.name}
          to={value.id}
          key={value.id}
        />
      ))} */}
    </NetworktreeLayout>
  );
};

export default StationsPage;
