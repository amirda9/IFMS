import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {Description, SimpleBtn, Table} from '~/components';
import AccessTablesView from './AccessTablesView';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  network: {label: 'Network', size: 'w-[90%]'},
};

type Props = {
  userId: string;
  access?: AccessEnum;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

const NetworkAccessTable: FC<Props> = ({
  userId,
  access = AccessEnum.admin,
  setIsEditing,
}) => {
  const [networkTableItems, setNetworkTableItems] = useState<
    {index: number; network: string}[]
  >([]);

  const networkAccessQuery = useHttpRequest({
    selector: state => state.http.userNetworkAccesses,
  });

  useEffect(() => {
    networkAccessQuery.request('userNetworkAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access},
    });
  }, [userId, access]);

  useEffect(() => {
    if (networkAccessQuery.state?.httpRequestStatus === 'success') {
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
          (networkAccessQuery.state.error?.data?.detail as string) ||
            'An unknown error has occurred.',
          {
            type: 'error',
          },
        );
      }
    }
  }, [networkAccessQuery.state]);

  return (
    <AccessTablesView
      editButtonText="Edit Network(s)"
      setIsEditing={setIsEditing!}
      tableItems={networkTableItems}
      tableColumns={columns}
      tableLoading={networkAccessQuery.state?.httpRequestStatus === 'loading'}
    />
  );
};

export default NetworkAccessTable;
