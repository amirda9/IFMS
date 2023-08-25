import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  region: {label: 'Region', size: 'w-[90%]'},
};

type Props = {
  userId: string;
  networkId: string;
  access?: AccessEnum;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
};

const RegionAccessTable: FC<Props> = ({
  userId,
  networkId,
  access = AccessEnum.admin,
  setIsEditing,
}) => {
  const [regionTableItems, setRegionTableItems] = useState<
    {index: number; region: string}[]
  >([]);

  const regionAccessQuery = useHttpRequest({
    selector: state => state.http.userRegionAccesses,
  });

  useEffect(() => {
    regionAccessQuery.request('userRegionAccesses', {
      params: {user_id: userId, access_type: access, network_id: networkId},
    });
  }, [userId, access, networkId]);

  useEffect(() => {
    if (regionAccessQuery.state?.httpRequestStatus === 'success') {
      if (regionAccessQuery.state.data) {
        setRegionTableItems(
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

  return (
    <>
      <div className="w-3/5 flex-1">
        <Table items={regionTableItems} cols={columns} />
      </div>
      <div className="self-end">
        <SimpleBtn
          className="self-end"
          type="submit"
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(true);
          }}>
          Edit Region(s)
        </SimpleBtn>
      </div>
    </>
  );
};

export default RegionAccessTable;
