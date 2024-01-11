import React, {useEffect, useState} from 'react';
import {SidebarItem} from '~/components';
import {SidebarLayout} from '~/layout';
import {useHttpRequest} from '~/hooks';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import ConfirmationModal from '~/components/modals/ConfirmationModal';
import {updateregionname} from './../../store/slices/networktreeslice'
import { useDispatch, useSelector } from 'react-redux';
import {BASE_URL} from './../../constant'
import NetworktreeLayout from '~/layout/networktreeLayout';
const RegionsPage = () => {
  const dispatch=useDispatch()
  const networkId = Cookies.get(networkExplored);
  const {networkDetail} = useSelector((state: any) => state.http);
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
  }
useEffect(()=>{
  getrole()
},[])


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
      <NetworktreeLayout
        // searchOnChange={() => {}}
        // createTitle="Regions"
        // canAdd={userrole == 'superuser' || networkDetail?.data?.access?.access == "ADMIN"?true:false}
        
        >
        {/* {regions?.data?.map(region => (
          <SidebarItem
            name={region.name}
            to={region.id}
            key={region.id}
            onDelete={userrole == 'superuser' || networkDetail?.data?.access?.access == "ADMIN"?() => {
              setRegionId(region.id);
            }:()=>{}}
          />
        ))} */}
      </NetworktreeLayout>
    </>
  );
};

export default RegionsPage;
