import React from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useHttpRequest} from '~/hooks';
import { useSelector } from 'react-redux';

const StationsPage = () => {
  const {stationDetail} = useSelector((state: any) => state.http);
  console.log(stationDetail, 'stationDetail');
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
      // stationDetail?.data?.access.access == 'ADMIN'?!!networkId:false
      canAdd={true}>
      {stations?.data?.map(value => (
        <SidebarItem name={value.name} to={value.id} key={value.id} />
      ))}
    </SidebarLayout>
  );
};

export default StationsPage;
