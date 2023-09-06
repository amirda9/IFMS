import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import AccessTablesView from './AccessTablesView';

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
  const [regionTableItems, setRegionTableItems] = useState<
    {index: number; region: string}[]
  >([]);

  const regionAccessQuery = useHttpRequest({
    selector: state => state.http.userRegionAccesses,
    onUpdate: (lastState, state) => {
      if (lastState?.httpRequestStatus === 'loading') {
        if (state?.httpRequestStatus === 'success') {
          if (state.data) {
            setRegionTableItems(
              state.data.map((item, index) => ({
                index: index + 1,
                region: item.region.name,
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
    regionAccessQuery.request('userRegionAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  return (
    <AccessTablesView
      editButtonText="Edit Region(s)"
      tableItems={regionTableItems}
      tableColumns={columns}
      tableLoading={regionAccessQuery.state?.httpRequestStatus === 'loading'}
    />
  );
};

export default RegionAccessTable;
