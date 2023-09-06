import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import AccessTablesView from './AccessTablesView';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  network: {label: 'Network', size: 'w-[90%]'},
};

type Props = {
  userId: string;
  access?: AccessEnum;
};

const NetworkAccessTable: FC<Props> = ({userId, access = AccessEnum.admin}) => {
  const [networkTableItems, setNetworkTableItems] = useState<
    {index: number; network: string}[]
  >([]);

  const networkAccessQuery = useHttpRequest({
    selector: state => state.http.userNetworkAccesses,
    onUpdate: (lastState, state) => {
      if (lastState?.httpRequestStatus === 'loading') {
        if (state?.httpRequestStatus === 'success') {
          if (state.data) {
            setNetworkTableItems(
              state.data.map((item, index) => ({
                index: index + 1,
                network: item.network.name,
              })),
            );
          }
        } else if (state?.httpRequestStatus === 'error') {
          if (state.error?.status === 422) {
          } // TODO: Handle correctly
          else {
            toast(
              (state.error?.data?.detail as string) ||
                'An unknown error has occurred.',
              {
                type: 'error',
              },
            );
          }
        }
      }
    },
  });

  useEffect(() => {
    networkAccessQuery.request('userNetworkAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access},
    });
  }, [userId, access]);

  return (
    <AccessTablesView
      editButtonText="Edit Network(s)"
      tableItems={networkTableItems}
      tableColumns={columns}
      tableLoading={networkAccessQuery.state?.httpRequestStatus === 'loading'}
    />
  );
};

export default NetworkAccessTable;
