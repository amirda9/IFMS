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
        request('networkStationList', {params: {network_id: networkId}});
      }
    },
  });
  return (
    <SidebarLayout
      searchOnChange={() => {}}
      createTitle="Stations"
      canAdd={!!networkId}>
      {stations?.data?.map((_, value) => (
        <SidebarItem
          name={`Station ${value + 1}`}
          to={value.toString()}
          key={value}
        />
      ))}
    </SidebarLayout>
  );
};

export default StationsPage;
