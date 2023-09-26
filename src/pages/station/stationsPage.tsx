import React, { useEffect, useState } from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useHttpRequest} from '~/hooks';
import { useSelector } from 'react-redux';
import {BASE_URL} from './../../constant'
const StationsPage = () => {
  const {stationDetail} = useSelector((state: any) => state.http);
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
    state: {stations},
  } = useHttpRequest({
    selector: state => ({stations: state.http.allStations}),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
      }
    },
  });

  console.log(stations,'stations');
  
  return (
    <SidebarLayout
      searchOnChange={() => {}}
      createTitle="Stations"
      canAdd={userrole == 'superuser'?true:false}>
      {stations?.data?.map(value => (
        <SidebarItem name={value.name} to={value.id} key={value.id} />
      ))}
    </SidebarLayout>
  );
};

export default StationsPage;
