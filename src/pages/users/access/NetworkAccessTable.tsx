import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {Table} from '~/components';

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
  });

  useEffect(() => {
    networkAccessQuery.request('userNetworkAccesses', {
      params: {user_id: userId, access_type: access},
    });
  }, [userId, access]);

  useEffect(() => {
    if (networkAccessQuery.state?.httpRequestStatus === 'success') {
      console.log(networkAccessQuery.state.data);
      if (networkAccessQuery.state.data) {
        setNetworkTableItems(
          networkAccessQuery.state.data.map((item, index) => ({
            index: index + 1,
            network: item.network.name,
          })),
        );
      }
    } else if (networkAccessQuery.state?.httpRequestStatus === 'error') {
      if (networkAccessQuery.state.error?.status === 422) {
      } // TODO: Handle correctly
      else {
        toast(
          (networkAccessQuery.state.error?.data.detail as string) ||
            'An unknown error has occurred.',
          {
            type: 'error',
          },
        );
      }
    }
  }, [networkAccessQuery.state]);

  return <Table items={networkTableItems} cols={columns} />;
};

export default NetworkAccessTable;
