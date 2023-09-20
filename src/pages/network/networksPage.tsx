import React, {FC} from 'react';
import {SidebarItem} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';

const NetworksPage: FC = () => {
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

  console.log(list,'list');
  
  return (
    <SidebarLayout searchOnChange={() => {}} createTitle="Networks" canAdd>
      {list?.data?.map(value => (
        <SidebarItem
          name={value.name}
          to={value.id}
          key={value.id}
          onDelete={() =>
            request('networkDelete', {params: {networkId: value.id}})
          }
          disabled={
            deleteRequest?.httpRequestStatus === 'loading' &&
            deleteRequest.request?.params.networkId === value.id
          }
        />
      ))}
    </SidebarLayout>
  );
};

export default NetworksPage;
