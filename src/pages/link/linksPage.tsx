import React, { useState } from 'react';
import { SidebarLayout } from "~/layout";
import { SidebarItem } from "~/components";
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import { useHttpRequest } from '~/hooks';
const LinksPage = () => {
  const [linkID, setLinkId] = useState<string | null>(null);
  const networkId = Cookies.get(networkExplored);
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
    <SidebarLayout searchOnChange={() => {}} createTitle="Links" canAdd>
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
