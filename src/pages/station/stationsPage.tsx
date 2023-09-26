import React, { useEffect, useState } from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useHttpRequest} from '~/hooks';
import { useSelector } from 'react-redux';
import {BASE_URL} from './../../constant'
const StationsPage = () => {

  const {stationDetail,networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken=JSON.parse(login || "")?.data.access_token
  const [userrole,setuserrole]=useState<any>("")
  const getrole=async()=>{
    const role=await fetch(`${BASE_URL}/auth/users/token/verify_token`,{
      headers: {
        Authorization:`Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json'},
    }).then(res =>res.json())
    setuserrole(role.role)
  console.log(role,'getrole');
  }
useEffect(()=>{
  getrole()
},[])
  const networkId = Cookies.get(networkExplored);
  const {
    state: {stations,networkstations},
  } = useHttpRequest({
    selector: state => ({stations: state.http.allStations,networkstations:state.http.networkstations}),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
        request('networkstations', {params:{network_id:networkId}});
      }
    },
  });

  console.log(networkDetail.data.access.access,'stations🥵');
  // console.log(networkstations,'networkstations');
  
  return (
    <SidebarLayout
      searchOnChange={() => {}}
      createTitle="Stations"
      canAdd={userrole == 'superuser' || networkDetail.data.access.access =="ADMIN"?true:false}>
      {stations?.data?.map(value => (
        <SidebarItem name={value.name} to={value.id} key={value.id} />
      ))}
    </SidebarLayout>
  );
};

export default StationsPage;
