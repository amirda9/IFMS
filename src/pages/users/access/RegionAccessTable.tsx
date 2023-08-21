import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  region: {label: 'Region', size: 'w-[90%]'},
};

type Props = {
  userId: string;
  networkId: string;
  access?: AccessEnum;
};

const RegionAccessTable: FC<Props> = ({
  userId,
  networkId,
  access = AccessEnum.admin,
}) => {
  const [networkList, setNetworkList] = useState<
    {index: number; region: string}[]
  >([]);

  const regionAccessQuery = useHttpRequest({
    selector: state => state.http.userRegionsAccesses,
  });

  useEffect(() => {
    regionAccessQuery.request('userRegionsAccesses', {
      params: {user_id: userId, access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  useEffect(() => {
    if (regionAccessQuery.state?.httpRequestStatus === 'success') {
      console.log(regionAccessQuery.state.data);
      if (regionAccessQuery.state.data) {
        setNetworkList(
          regionAccessQuery.state.data.map((item, index) => ({
            index: index + 1,
            region: item.region.name,
          })),
        );
      }
    } else if (regionAccessQuery.state?.httpRequestStatus === 'error') {
      if (regionAccessQuery.state.error?.status === 422) {
      } // TODO: Handle correctly
      else {
        toast(
          (regionAccessQuery.state.error?.data.detail as string) ||
            'An unknown error has occurred.',
          {
            type: 'error',
          },
        );
      }
    }
  }, [regionAccessQuery.state]);

  return <Table items={networkList} cols={columns} />;
};

export default RegionAccessTable;
