import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';

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
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

const StationAccessTable: FC<Props> = ({
  userId,
  networkId,
  access = AccessEnum.admin,
  setIsEditing,
}) => {
  const [stationTableItems, setStationTableItems] = useState<
    {index: number; station: string; lat: 0; long: 0}[]
  >([]);

  const stationAccessQuery = useHttpRequest({
    selector: state => state.http.userStationAccesses,
  });

  useEffect(() => {
    stationAccessQuery.request('userStationAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  useEffect(() => {
    if (stationAccessQuery.state?.httpRequestStatus === 'success') {
      if (stationAccessQuery.state.data) {
        setStationTableItems(
          stationAccessQuery.state.data.map((item, index) => ({
            index: index + 1,
            station: item.station.name,
            lat: 0,
            long: 0,
          })),
        );
      }
    } else if (stationAccessQuery.state?.httpRequestStatus === 'error') {
      if (stationAccessQuery.state.error?.status === 422) {
      } // TODO: Handle correctly
      else {
        toast(
          (stationAccessQuery.state.error?.data?.detail as string) ||
            'An unknown error has occurred.',
          {
            type: 'error',
          },
        );
      }
    }
  }, [stationAccessQuery.state]);

  return (
    <>
      <div className="w-3/5 flex-1">
        <Table items={stationTableItems} cols={columns} />
      </div>
      <div className="self-end">
        <SimpleBtn
          className="self-end"
          type="submit"
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(true);
          }}>
          Edit Station(s)
        </SimpleBtn>
      </div>
    </>
  );
};

export default StationAccessTable;
