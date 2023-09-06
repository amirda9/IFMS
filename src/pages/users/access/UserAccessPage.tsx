import {FC, useState} from 'react';
import {ControlledSelect, Description} from '~/components';
import {ResourceAccessType, UserRole} from '~/constant/users';
import AccessTable from './AccessTable';
import {useLocation, useParams} from 'react-router-dom';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {NetworkType} from '~/types';
import ErrorPage403 from '~/pages/errors/403';

const roleOptions = Object.values(ResourceAccessType)
  .filter(val => val !== ResourceAccessType.SUPER_ADMIN)
  .map(role => ({label: role}));

const rolesNeedingNetwork = [
  ResourceAccessType.REGION_ADMIN,
  ResourceAccessType.REGION_VIEWER,
  ResourceAccessType.STATION_ADMIN,
  ResourceAccessType.STATION_VIEWER,
  ResourceAccessType.LINK_ADMIN,
  ResourceAccessType.LINK_VIEWER,
];

type NetworkOptionType = {label: string; payload: NetworkType | null};

const UserAccessPage: FC = () => {
  const {userId} = useParams();
  const location = useLocation();

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;

  if (loggedInUser.role !== UserRole.SUPER_USER && loggedInUser.id !== userId) {
    return <ErrorPage403 />;
  }

  const [selectedRole, setSelectedRole] = useState<ResourceAccessType>(
    ResourceAccessType.NETWORK_ADMIN,
  );

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
          {location.state?.isEditingUserAccess ? (
            <span>{selectedRole}</span>
          ) : (
            <ControlledSelect
              options={roleOptions}
              onChange={value => setSelectedRole(value as ResourceAccessType)}
              value={selectedRole}
              setValueProp={option => option.label}
            />
          )}
        </Description>

        {rolesNeedingNetwork.includes(selectedRole) && (
          <Description label="Network" items="start">
            {location.state?.isEditingUserAccess ? (
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
