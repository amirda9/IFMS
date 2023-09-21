import React from 'react';
import { SidebarLayout } from "~/layout";
import { SidebarItem } from "~/components";
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import { useHttpRequest } from '~/hooks';
const LinksPage = () => {
  const networkId = Cookies.get(networkExplored);
  const {
    state: {links},
  } = useHttpRequest({
    selector: state => ({links: state.http.allLinks}),
    initialRequests: request => {
      if (networkId) {
        request('allLinks', undefined);
      }
    },
  });
  console.log(links,'linkslinks');
  
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Links" canAdd={true}>
      {links?.data?.map((_, value) => (
        <SidebarItem
          name={`Link ${value + 1}`}
          to={value.toString()}
          key={value}
        />
      ))}
    </SidebarLayout>
  );
};

export default LinksPage;
