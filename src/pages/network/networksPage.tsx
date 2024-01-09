import React, {FC, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {SidebarItem} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import {BASE_URL} from './../../constant';
import NetworktreeLayout from '~/layout/networktreeLayout';

const NetworksPage: FC = () => {
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    setuserrole(role.role);
    console.log(role, 'getrole');
  };
  useEffect(() => {
    getrole();
  }, []);

  const {
    request,
    state: {list, deleteRequest},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      deleteRequest: state.http.networkDelete,
    }),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.deleteRequest?.httpRequestStatus === 'loading' &&
        state.deleteRequest!.httpRequestStatus === 'success'
      ) {
        request('networkList', undefined);
      }
    },
  });

  return (
    <NetworktreeLayout
      // searchOnChange={() => {}}
      // createTitle="Networks"
      // canAdd={userrole == 'superuser' ? true : false}
      >
        <div className='w-full flex flex-col mb-[-18px]'>
        {/* {list?.data?.map(value => (
        <div className='flex flex-row items-center w-full'>
          <span className='text-[14px]'>....</span>
          <SidebarItem
          selected={true}
          className='flex-start w-full pl-[2px]'
          name={value.name}
          to={value.id}
          key={value.id}
          onDelete={
            userrole == 'superuser'
              ? () => request('networkDelete', {params: {networkId: value.id}})
              : () => {}
          }
          disabled={
            deleteRequest?.httpRequestStatus === 'loading' &&
            deleteRequest.request?.params.networkId === value.id
          }
        />
        </div>
     
      ))} */}
        </div>

    </NetworktreeLayout>
  );
};

export default NetworksPage;
