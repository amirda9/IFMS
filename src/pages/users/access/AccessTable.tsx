import {FC} from 'react';
import {Role} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';

type Props = {
  userId: string;
  role: Role;
};

const AccessTable: FC<Props> = ({userId, role}) => {
  let tableToRender = <></>;
  switch (role) {
    case Role.NETWORK_ADMIN:
      tableToRender = <NetworkAccessTable userId={userId} />;
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
