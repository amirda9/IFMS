import {Dispatch, FC, SetStateAction} from 'react';
import {Role} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';
import {AccessEnum} from '~/types';
import RegionAccessTable from './RegionAccessTable';
import StationAccessTable from './StationAccessTable';
import LinkAccessTable from './LinkAccessTable';
import {Description, SimpleBtn} from '~/components';

type Props = {
  userId: string;
  networkId?: string;
  role: Role;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  hideEditButton?: boolean;
};

const AccessTable: FC<Props> = ({
  userId,
  networkId,
  role,
  hideEditButton = false,
  setIsEditing,
}) => {
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
      if (!networkId) {
        tableToRender = <></>;
        break;
      }

      tableToRender = (
        <StationAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
    case Role.STATION_VIEWER:
      if (!networkId) {
        tableToRender = <></>;
        break;
      }

      tableToRender = (
        <StationAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.viewer}
        />
      );
      break;
    case Role.LINK_ADMIN:
      if (!networkId) {
        tableToRender = <></>;
        break;
      }

      tableToRender = (
        <LinkAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
    case Role.LINK_VIEWER:
      if (!networkId) {
        tableToRender = <></>;
        break;
      }

      tableToRender = (
        <LinkAccessTable
          userId={userId}
          networkId={networkId}
          access={AccessEnum.admin}
        />
      );
      break;
  }
  return (
    <>
      <Description label="" items="start">
        {tableToRender}
      </Description>
      <div className="flex gap-x-2 self-end">
        {!hideEditButton && (
          <SimpleBtn
            type="submit"
            onClick={() => {
              setIsEditing(true);
            }}>
            Edit
          </SimpleBtn>
        )}
      </div>
    </>
  );
};

export default AccessTable;
