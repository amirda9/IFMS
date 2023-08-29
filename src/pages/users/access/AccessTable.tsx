import {Dispatch, FC, SetStateAction} from 'react';
import {Role} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';
import {AccessEnum} from '~/types';
import RegionAccessTable from './RegionAccessTable';
import StationAccessTable from './StationAccessTable';
import LinkAccessTable from './LinkAccessTable';
import NetworkEditAccessTable from './NetworkEditAccessTable';
import RegionEditAccessTable from './RegionEditAccessTable';
import StationEditAccessTable from './StationEditAccessTable';
import LinkEditAccessTable from './LinkEditAccessTables';
import {Description} from '~/components';

type Props = {
  userId: string;
  networkId?: string;
  role: Role;
  isEditing?: boolean;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
  hideEditButton?: boolean;
};

const AccessTable: FC<Props> = ({
  userId,
  networkId,
  role,
  isEditing,
  hideEditButton = false,
  setIsEditing,
}) => {
  let tableToRender = <></>;
  let editTableToRender = <></>;

  switch (role) {
    case Role.NETWORK_ADMIN:
      tableToRender = (
        <NetworkAccessTable
          userId={userId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <NetworkEditAccessTable
          userId={userId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.NETWORK_VIEWER:
      tableToRender = (
        <NetworkAccessTable
          userId={userId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <NetworkEditAccessTable
          userId={userId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.REGION_ADMIN:
      if (!networkId) break;

      tableToRender = (
        <RegionAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <RegionEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.REGION_VIEWER:
      if (!networkId) break;

      tableToRender = (
        <RegionAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <RegionEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.STATION_ADMIN:
      if (!networkId) break;

      tableToRender = (
        <StationAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <StationEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.STATION_VIEWER:
      if (!networkId) break;

      tableToRender = (
        <StationAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <StationEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.LINK_ADMIN:
      if (!networkId) break;

      tableToRender = (
        <LinkAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <LinkEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      break;
    case Role.LINK_VIEWER:
      if (!networkId) break;

      tableToRender = (
        <LinkAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
          setIsEditing={setIsEditing}
        />
      );
      editTableToRender = (
        <LinkEditAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
          setIsEditing={setIsEditing}
        />
      );
      break;
  }
  return <>{isEditing ? editTableToRender : tableToRender}</>;
};

export default AccessTable;
