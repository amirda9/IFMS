import React, { useEffect, useMemo, useState } from 'react';
import {SimpleBtn} from '~/components';
import {IoTrashOutline} from 'react-icons/io5';
import {FormLayout} from '~/layout';
import {useSelector} from 'react-redux';
import { useAppSelector, useHttpRequest } from '~/hooks';
import {Request} from '~/hooks/useHttpRequest';
import { useParams } from 'react-router-dom';
import { UserRole } from '~/constant/users';
import ErrorPage403 from '../errors/403';
const NetworkGisPage = () => {
  const login = localStorage.getItem('login');
  const params = useParams<{networkId: string}>();
  const {networkDetail} = useSelector((state: any) => state.http);
  const {networkidadmin} = useSelector((state: any) => state.networktree);

  const initialRequests = (request: Request) => {
    request('networkDetail', {params: {networkId: params.networkId!}});
  };
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
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

  const canchange=useMemo(()=>  {
    let isnetworkadmin=networkidadmin.findIndex((data:string) => data ==params.networkId!)>-1?true:false;
    if(isnetworkadmin || loggedInUser.role == UserRole.SUPER_USER){
      return true
    }else{
      return false
    }
  }
  ,[params.networkId])
  const buttons = (
    <>
    {canchange?
      <SimpleBtn link to="../edit-access">
        Add Shapefile
      </SimpleBtn>:null}
      <SimpleBtn>History</SimpleBtn>
      {canchange?
      <SimpleBtn>Save</SimpleBtn>:null}
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

const deleteshapefile=(id:string)=>{
  request('deleteShapefile', {params: {shapefile_id: id}});
}                                                        
if(canchange){
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
                {canchange?
                <IoTrashOutline
                onClick={()=>deleteshapefile(data.id)}
                  size={24}
                  className="text-red-500 active:text-red-300"
                />:null}
              </div>
            </div>
          ),
        )}
      </div>
    </FormLayout>
  );
}else{
  return <ErrorPage403 />;
 
}

};

export default NetworkGisPage;
