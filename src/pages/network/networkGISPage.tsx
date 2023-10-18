import React, { useEffect, useState } from 'react';
import {SimpleBtn} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';
import {useSelector} from 'react-redux';
import {log} from 'console';
import { useHttpRequest } from '~/hooks';
import {Request} from '~/hooks/useHttpRequest';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '~/constant';
const NetworkGisPage = () => {
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
  const params = useParams<{networkId: string}>();
  const {networkDetail} = useSelector((state: any) => state.http);
  const initialRequests = (request: Request) => {
    request('networkDetail', {params: {networkId: params.networkId!}});
  };

  const {
    state: {detail, update},
    request,
  } = useHttpRequest({
    selector: state => ({
      detail: state.http.networkDetail,
      update: state.http.networkUpdate,
    }),
    initialRequests,
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        initialRequests(request);
      }
    },
  });
  const buttons = (
    <>
    {userrole == 'superuser' || networkDetail.data.access.access == 'ADMIN'?
      <SimpleBtn link to="../edit-access">
        Add Shapefile
      </SimpleBtn>:null}
      <SimpleBtn>Explore</SimpleBtn>
      <SimpleBtn>History</SimpleBtn>
      {userrole == 'superuser' || networkDetail.data.access.access == 'ADMIN'?
      <SimpleBtn>Save</SimpleBtn>:null}
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );
  console.log(networkDetail?.data?.shapefiles, '😁');

const deleteshapefile=(id:string)=>{
  request('deleteShapefile', {params: {shapefile_id: id}});
}                                                        

  return (
    <FormLayout buttons={buttons}>
      <div className="flex flex-col gap-y-4">
        {networkDetail?.data?.shapefiles?.map(
          (
            data: {
              id: string;
              path: string;
              title: string;
            },
            index: number,
          ) => (
            <div className="flex h-20 w-2/3 flex-row items-center justify-between rounded-lg bg-gis px-4">
              <div className="flex flex-row gap-x-20">
                <span>{index + 1}</span>
                <span>{data.title}</span>
              </div>
              <div className="flex flex-row gap-x-8">
                <SimpleBtn >Download</SimpleBtn>
                <IoTrashOutline
                onClick={()=>deleteshapefile(data.id)}
                  size={24}
                  className="text-red-500 active:text-red-300"
                />
              </div>
            </div>
          ),
        )}
      </div>
    </FormLayout>
  );
};

export default NetworkGisPage;
