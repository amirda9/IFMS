import {FC} from 'react';
import {Role} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';
import {AccessEnum} from '~/types';

type Props = {
  userId: string;
  role: Role;
};

const AccessTable: FC<Props> = ({userId, role}) => {
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
      // tableToRender =
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
