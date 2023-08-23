import {FC, useState} from 'react';
import {ControlledSelect, Description, Select, SimpleBtn} from '~/components';
import {Role} from '~/constant/users';
import AccessTable from './AccessTable';
import {useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {NetworkType} from '~/types';
import EditAccessTables from './EditAccessTables';

const roleOptions = Object.values(Role)
  .filter(val => val !== Role.SUPER_ADMIN)
  .map(role => ({label: role}));

const rolesNeedingNetwork = [
  Role.REGION_ADMIN,
  Role.REGION_VIEWER,
  Role.STATION_ADMIN,
  Role.STATION_VIEWER,
  Role.LINK_ADMIN,
  Role.LINK_VIEWER,
];

type NetworkOptionType = {label: string; payload: NetworkType | null};

const UserAccessPage: FC = () => {
  const {userId} = useParams();
  const [selectedRole, setSelectedRole] = useState<Role>(Role.NETWORK_ADMIN);

  const [networkOptions, setNetworkOptions] = useState<NetworkOptionType[]>([]);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);

  const allNetworksQuery = useHttpRequest({
    selector: state => state.http.networkList,
    initialRequests: request => {
      request('networkList', undefined);
    },
    onUpdate: (_lastSate, state) => {
      if (state?.httpRequestStatus === 'success') {
        const networksToSet: NetworkOptionType[] =
          state.data?.map(network => ({
            label: network.name,
            payload: network,
          })) || [];
        networksToSet.unshift({label: 'Select Network', payload: null});
        setNetworkOptions(networksToSet);
      }
    },
  });

  return (
    <div className="flex w-3/4 flex-grow flex-col gap-y-4">
      <div className="flex">
        <Description label="Role" items="start">
          <ControlledSelect
            options={roleOptions}
            onChange={value => setSelectedRole(value as Role)}
            value={selectedRole}
            setValueProp={option => option.label}
          />
        </Description>

        {rolesNeedingNetwork.includes(selectedRole) && (
          <Description label="Network" items="start">
            <ControlledSelect
              options={networkOptions}
              onChange={value => setSelectedNetworkId(value as string)}
              value={selectedNetworkId || ''}
              setValueProp={option => option.payload?.id}
            />
          </Description>
        )}
      </div>
      <Description label="" items="start" className="flex-1">
        {isEditing ? (
          <EditAccessTables />
        ) : (
          <AccessTable
            userId={userId!}
            role={selectedRole}
            networkId={selectedNetworkId}
          />
        )}
      </Description>
      <div className="flex gap-x-2 self-end">
        {isEditing ? (
          <>
            <SimpleBtn
              type="submit"
              onClick={() => {
                alert('TO BE IMPLEMENTED!');
              }}>
              Ok
            </SimpleBtn>
            <SimpleBtn
              onClick={() => {
                setIsEditing(false);
              }}>
              Cancel
            </SimpleBtn>
          </>
        ) : (
          <SimpleBtn
            type="submit"
            onClick={() => {
              setIsEditing(true);
            }}>
            Edit
          </SimpleBtn>
        )}
      </div>
    </div>
  );
};

export default UserAccessPage;
