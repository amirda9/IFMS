import React from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useHttpRequest} from '~/hooks';

const StationsPage = () => {
  const networkId = Cookies.get(networkExplored);
  const {
    state: {stations},
  } = useHttpRequest({
    selector: state => ({stations: state.http.networkStationList}),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
      }
    },
  });
  return (
    <SidebarLayout
      searchOnChange={() => {}}
      createTitle="Stations"
      canAdd={!!networkId}>
      {stations?.data?.map(value => (
        <SidebarItem name={value.name} to={value.id} key={value.id} />
      ))}
    </SidebarLayout>
  );
};

export default StationsPage;
