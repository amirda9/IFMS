import {Dispatch, FC, SetStateAction} from 'react';
import {Role} from '~/constant/users';
import NetworkAccessTable from './NetworkAccessTable';
import {AccessEnum} from '~/types';
import RegionAccessTable from './RegionAccessTable';
import StationAccessTable from './StationAccessTable';
import LinkAccessTable from './LinkAccessTable';
import {SimpleBtn} from '~/components';
import NetworkEditAccessTable from './NetworkEditAccessTable';

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
        <NetworkAccessTable userId={userId} access={AccessEnum.admin} />
      );
      editTableToRender = (
        <NetworkEditAccessTable userId={userId} access={AccessEnum.admin} />
      );
      break;
    case Role.NETWORK_VIEWER:
      tableToRender = (
        <NetworkAccessTable userId={userId} access={AccessEnum.viewer} />
      );
      editTableToRender = (
        <NetworkEditAccessTable userId={userId} access={AccessEnum.viewer} />
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
      {isEditing ? editTableToRender : tableToRender}
      <div className="flex gap-x-2 self-end">
        {!hideEditButton &&
          (isEditing ? (
            <>
              <SimpleBtn
                onClick={() => {
                  alert('Not implemented yet...');
                }}>
                Save
              </SimpleBtn>
              <SimpleBtn
                type="submit"
                onClick={() => {
                  if (typeof setIsEditing === 'function') setIsEditing(false);
                }}>
                Cancel
              </SimpleBtn>
            </>
          ) : (
            <SimpleBtn
              type="submit"
              onClick={() => {
                if (typeof setIsEditing === 'function') setIsEditing(true);
              }}>
              Edit
            </SimpleBtn>
          ))}
      </div>
    </>
  );
};

export default AccessTable;
