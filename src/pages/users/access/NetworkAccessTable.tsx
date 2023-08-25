import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';

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
      params: {user_id: userId, access_type: access},
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
          (networkAccessQuery.state.error?.data.detail as string) ||
            'An unknown error has occurred.',
          {
            type: 'error',
          },
        );
      }
    }
  }, [networkAccessQuery.state]);

  return (
    <>
      <div className='flex-1 w-3/5'>
        <Table items={networkTableItems} cols={columns} />
      </div>
      <div className='self-end'>
        <SimpleBtn
          className="self-end"
          type="submit"
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(true);
          }}>
          Edit Network(s)
        </SimpleBtn>
      </div>
    </>
  );
};

export default NetworkAccessTable;
