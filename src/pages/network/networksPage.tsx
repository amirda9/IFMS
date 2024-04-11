import  {FC} from 'react';
import {useHttpRequest} from '~/hooks';
import NetworktreeLayout from '~/layout/networktreeLayout';

const NetworksPage: FC = () => {
  const {
    request,
    state: {list},
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
      >
        <div className='w-full flex flex-col mb-[-18px]'>
      
        </div>

    </NetworktreeLayout>
  );
};

export default NetworksPage;
