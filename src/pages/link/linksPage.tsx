import React, {useEffect, useState} from 'react';
import {SidebarLayout} from '~/layout';
import {SidebarItem} from '~/components';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {useHttpRequest} from '~/hooks';
import {BASE_URL} from './../../constant';
import {useSelector} from 'react-redux';
import NetworktreeLayout from '~/layout/networktreeLayout';
const LinksPage = () => {
  const {stationDetail, networkDetail} = useSelector(
    (state: any) => state.http,
  );
  const [linkID, setLinkId] = useState<string | null>(null);
  const networkId = Cookies.get(networkExplored);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application?.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res?.json());
    setuserrole(role.role);
    console.log(role, 'getrole');
  };
  useEffect(() => {
    getrole();
  }, []);
  const {
    state: {links},
    request,
  } = useHttpRequest({
    selector: state => ({
      links: state.http.allLinks,
      deleteLink: state.http.linkDelete,
    }),
    initialRequests: request => {
      if (networkId) {
        request('allLinks', undefined);
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.deleteLink?.httpRequestStatus === 'loading' &&
        state.deleteLink?.httpRequestStatus === 'success'
      ) {
        request('allLinks', undefined);
        setLinkId(null);
      }
    },
  });
  console.log(links, 'linkslinks');

  return (
    <NetworktreeLayout

    // searchOnChange={() => {}} createTitle="Links" canAdd={userrole == 'superuser' || networkDetail?.data?.access?.access =="ADMIN"?true:false}
    >
   <>
</>
    </NetworktreeLayout>
  );
};

export default LinksPage;
