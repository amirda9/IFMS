import {FC, useState} from 'react';
import {ControlledSelect, Description, Select} from '~/components';
import {Role} from '~/constant/users';
import AccessTable from './AccessTable';
import {useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {NetworkType} from '~/types';

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
    <div className="w-3/5">
      <div className="flex">
        <Description label="Role" items="start" className="mb-4">
          <ControlledSelect
            options={roleOptions}
            onChange={value => setSelectedRole(value as Role)}
            value={selectedRole}
            setValueProp={option => option.label}
          />
        </Description>

        {rolesNeedingNetwork.includes(selectedRole) && (
          <Description label="Network" items="start" className="mb-4">
            <ControlledSelect
              options={networkOptions}
              onChange={value => setSelectedNetworkId(value as string)}
              value={selectedNetworkId || ''}
              setValueProp={option => option.payload?.id}
            />
          </Description>
        )}
      </div>
      <Description label="" items="start" className="h-full">
        <AccessTable
          userId={userId!}
          role={selectedRole}
          networkId={selectedNetworkId}
        />
      </Description>
    </div>
  );
};

export default UserAccessPage;
