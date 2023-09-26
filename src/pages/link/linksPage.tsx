import React, { useEffect, useState } from 'react';
import { SidebarLayout } from "~/layout";
import { SidebarItem } from "~/components";
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import { useHttpRequest } from '~/hooks';
const LinksPage = () => {
  const [linkID, setLinkId] = useState<string | null>(null);
  const networkId = Cookies.get(networkExplored);
  const login = localStorage.getItem('login');
  const accesstoken=JSON.parse(login || "")?.data.access_token
  const [userrole,setuserrole]=useState<any>("")
  const getrole=async()=>{
    const role=await fetch('http://37.32.27.143:8080/api/auth/users/token/verify_token',{
      headers: {
        Authorization:`Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json'},
    }).then(res =>res.json())
    setuserrole(role.role)
  console.log(role,'getrole');
  }
useEffect(()=>{
  getrole()
},[])
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
        request('allLinks',undefined);
        setLinkId(null);
      }
    },
  });
  console.log(links,'linkslinks');
  
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Links" canAdd={userrole == 'superuser'?true:false}>
      {links?.data?.map((value, index) => (
        <SidebarItem
          name={`${value.name}`}
          to={value.id.toString()}
          key={index}
          onDelete={() => {
            request('linkDelete', {params: {link_id: value.id}})
          }}
        />
      ))}
    </SidebarLayout>
  );
};

export default LinksPage;
