import {FC, useState} from 'react';
import {ControlledSelect, Description} from '~/components';
import {Role} from '~/constant/users';
import AccessTable from './AccessTable';
import {useParams} from 'react-router-dom';
import {useAppSelector, useHttpRequest} from '~/hooks';
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
  const isEditingUserAccess = useAppSelector(
    state => state.userAccess.isEditingUserAccess,
  );

  const [selectedRole, setSelectedRole] = useState<Role>(Role.NETWORK_ADMIN);

  const [networkOptions, setNetworkOptions] = useState<NetworkOptionType[]>([]);
  const [selectedNetworkId, setSelectedNetworkId] = useState<string>('');

  useHttpRequest({
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
    <div className="flex flex-grow flex-col gap-y-4">
      <div className="flex w-3/5 justify-between">
        <Description label="Role" items="start">
          {isEditingUserAccess ? (
            <span>{selectedRole}</span>
          ) : (
            <ControlledSelect
              options={roleOptions}
              onChange={value => setSelectedRole(value as Role)}
              value={selectedRole}
              setValueProp={option => option.label}
            />
          )}
        </Description>

        {rolesNeedingNetwork.includes(selectedRole) && (
          <Description label="Network" items="start">
            {isEditingUserAccess ? (
              <span>
                {
                  networkOptions.find(
                    item => item.payload?.id === selectedNetworkId,
                  )?.label
                }
              </span>
            ) : (
              <ControlledSelect
                options={networkOptions}
                onChange={value => setSelectedNetworkId(value as string)}
                value={selectedNetworkId || ''}
                setValueProp={option => option.payload?.id}
              />
            )}
          </Description>
        )}
      </div>

      <AccessTable
        userId={userId!}
        role={selectedRole}
        networkId={selectedNetworkId}
      />
    </div>
  );
};

export default UserAccessPage;
