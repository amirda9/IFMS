import {FC} from 'react';
import {ResourceAccessType} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';
import {AccessEnum} from '~/types';
import RegionAccessTable from './RegionAccessTable';
import StationAccessTable from './StationAccessTable';
import LinkAccessTable from './LinkAccessTable';
import NetworkEditAccessTable from './NetworkEditAccessTable';
import RegionEditAccessTable from './RegionEditAccessTable';
import StationEditAccessTable from './StationEditAccessTable';
import LinkEditAccessTable from './LinkEditAccessTables';
import {useAppSelector} from '~/hooks';

type Props = {
  userId: string;
  networkId?: string;
  role: ResourceAccessType;
  isEditing?: boolean;
  hideEditButton?: boolean;
};

const AccessTable: FC<Props> = ({
  userId,
  networkId,
  role,
  isEditing,
  hideEditButton = false,
}) => {
  const isEditingUserAccess = useAppSelector(
    state => state.userAccess.isEditingUserAccess,
  );

  let tableToRender = <></>;
  let editTableToRender = <></>;

  switch (role) {
    case ResourceAccessType.NETWORK_ADMIN:
      tableToRender = (
        <NetworkAccessTable userId={userId} access={AccessEnum.admin} />
      );
      editTableToRender = (
        <NetworkEditAccessTable userId={userId} access={AccessEnum.admin} />
      );
      break;
    case ResourceAccessType.NETWORK_VIEWER:
      tableToRender = (
        <NetworkAccessTable userId={userId} access={AccessEnum.viewer} />
      );
      editTableToRender = (
        <NetworkEditAccessTable userId={userId} access={AccessEnum.viewer} />
      );
      break;
    case ResourceAccessType.REGION_ADMIN:
      if (!networkId) break;

      tableToRender = (
        <RegionAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      editTableToRender = (
        <RegionEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
    case ResourceAccessType.REGION_VIEWER:
      if (!networkId) break;

      tableToRender = (
        <RegionAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      editTableToRender = (
        <RegionEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      break;
    case ResourceAccessType.STATION_ADMIN:
      if (!networkId) break;

      tableToRender = (
        <StationAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      editTableToRender = (
        <StationEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
    case ResourceAccessType.STATION_VIEWER:
      if (!networkId) break;

      tableToRender = (
        <StationAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      editTableToRender = (
        <StationEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      break;
    case ResourceAccessType.LINK_ADMIN:
      if (!networkId) break;

      tableToRender = (
        <LinkAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      editTableToRender = (
        <LinkEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
    case ResourceAccessType.LINK_VIEWER:
      if (!networkId) break;

      tableToRender = (
        <LinkAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      editTableToRender = (
        <LinkEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      break;
  }
  return <>{isEditingUserAccess ? editTableToRender : tableToRender}</>;
};

export default AccessTable;
