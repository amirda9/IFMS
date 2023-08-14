import React from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';

const RegionsPage = () => {
  const networkId = Cookies.get(networkExplored);
  const {
    state: {regions},
  } = useHttpRequest({
    selector: state => ({regions: state.http.regionList}),
    initialRequests: request => {
      if (networkId) {
        request('regionList', {params: {network_id: networkId}});
      }
    },
  });
  return (
    <SidebarLayout
      searchOnChange={() => {}}
      createTitle="Regions"
      canAdd={!!networkId}>
      {regions?.data?.map(region => (
        <SidebarItem name={region.name} to={region.id} key={region.id} />
      ))}
    </SidebarLayout>
  );
};

export default RegionsPage;
