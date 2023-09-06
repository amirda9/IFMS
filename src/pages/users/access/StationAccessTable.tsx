import {FC, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import AccessTablesView from './AccessTablesView';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  station: {label: 'Station', size: 'w-[50%]'},
  lat: {label: 'Latitude', size: 'w-[20%]'},
  long: {label: 'Longitude', size: 'w-[20%]'},
};

type Props = {
  userId: string;
  networkId: string;
  access?: AccessEnum;
};

const StationAccessTable: FC<Props> = ({
  userId,
  networkId,
  access = AccessEnum.admin,
}) => {
  const [stationTableItems, setStationTableItems] = useState<
    {index: number; station: string; lat: 0; long: 0}[]
  >([]);

  const stationAccessQuery = useHttpRequest({
    selector: state => state.http.userStationAccesses,
    onUpdate: (lastState, state) => {
      if (lastState?.httpRequestStatus === 'loading') {
        if (state?.httpRequestStatus === 'success') {
          if (state.data) {
            setStationTableItems(
              state.data.map((item, index) => ({
                index: index + 1,
                station: item.station.name,
                lat: 0,
                long: 0,
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
    stationAccessQuery.request('userStationAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  return (
    <AccessTablesView
      editButtonText="Edit Station(s)"
      tableItems={stationTableItems}
      tableColumns={columns}
      tableLoading={stationAccessQuery.state?.httpRequestStatus === 'loading'}
    />
  );
};

export default StationAccessTable;
