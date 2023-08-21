import {FC} from 'react';
import {Role} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';
import {AccessEnum} from '~/types';
import RegionAccessTable from './RegionAccessTable';

type Props = {
  userId: string;
  networkId?: string;
  role: Role;
};

const AccessTable: FC<Props> = ({userId, networkId, role}) => {
  let tableToRender = <></>;
  switch (role) {
    case Role.NETWORK_ADMIN:
      tableToRender = (
        <NetworkAccessTable userId={userId} access={AccessEnum.admin} />
      );
      break;
    case Role.NETWORK_VIEWER:
      tableToRender = (
        <NetworkAccessTable userId={userId} access={AccessEnum.viewer} />
      );
      break;
    case Role.REGION_ADMIN:
      if (!networkId) {
        tableToRender = <></>;
        break;
      }

      tableToRender = (
        <RegionAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
    case Role.REGION_VIEWER:
      if (!networkId) {
        tableToRender = <></>;
        break;
      }

      tableToRender = (
        <RegionAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      break;
    case Role.STATION_ADMIN:
      // tableToRender =
      break;
    case Role.LINK_ADMIN:
      break;
  }
  return <>{tableToRender}</>;
};

export default AccessTable;
