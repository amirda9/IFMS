import React, {useState} from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import { useSelector } from 'react-redux';

const RegionsPage = () => {
  const networkId = Cookies.get(networkExplored);
  const {regionDetail} = useSelector((state: any) => state.http);

  const [regionID, setRegionId] = useState<string | null>(null);
  const {
    state: {regions},
    request,
  } = useHttpRequest({
    selector: state => ({
      regions: state.http.regionList,
      deleteRegion: state.http.regionDelete,
    }),
    initialRequests: request => {
      if (networkId) {
        request('regionList', {params: {network_id: networkId}});
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.deleteRegion?.httpRequestStatus === 'loading' &&
        state.deleteRegion?.httpRequestStatus === 'success'
      ) {
        request('regionList', {params: {network_id: networkId!}});
        setRegionId(null);
      }
    },
  });
  return (
    <>
      <ConfirmationModal
        open={!!regionID}
        setOpen={() => {
          setRegionId(null);
        }}
        onPrimaryClick={() => {
          request('regionDelete', {params: {region_id: regionID!}});
        }}
        title="Do you wand to delete?"
        description="Are you sure about delete this item?"
        type="danger"
        primaryButtonText="Delete"
      />
      <SidebarLayout
        searchOnChange={() => {}}
        createTitle="Regions"
        // regionDetail?.data?.access.access == 'ADMIN' ?!!networkId:false
        canAdd={true}>
        {regions?.data?.map(region => (
          <SidebarItem
            name={region.name}
            to={region.id}
            key={region.id}
            onDelete={() => {
              setRegionId(region.id);
            }}
          />
        ))}
      </SidebarLayout>
    </>
  );
};

export default RegionsPage;
