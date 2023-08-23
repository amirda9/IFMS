import {FC, useEffect, useState} from 'react';
import {Table} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';

type Props = {
  userId: string;
  access: AccessEnum;
};

const columns = {
  select: {label: '', size: 'w-[5%]'},
  index: {label: '#', size: 'w-[10%]'},
  network: {label: 'Network', size: 'w-[85%]'},
};

type AccessNetworkTableItem = {
  select: boolean;
  index: number;
  network: string;
};

const NetworkEditAccessTable: FC<Props> = ({
  userId,
  access = AccessEnum.admin,
}) => {
  const [noAccessNetworks, setNoAccessNetworks] = useState<
    AccessNetworkTableItem[]
  >([]);
  const [accessedNetworks, setAccessedNetworks] = useState<
    AccessNetworkTableItem[]
  >([]);

  const [noAccessSelected, setNoAccessSelected] = useState<number[]>([]);
  const [accessedNetsSelected, setAccessedNetsSelected] = useState<number[]>(
    [],
  );

  useHttpRequest({
    selector: state => ({
      networkList: state.http.networkList,
      userNetworkAccesses: state.http.userNetworkAccesses,
    }),
    initialRequests: request => {
      request('networkList', undefined);
      request('userNetworkAccesses', {
        params: {user_id: userId, access_type: access},
      });
    },
    onUpdate: (_lastState, state) => {
      if (
        state.networkList?.httpRequestStatus === 'success' &&
        state.userNetworkAccesses?.httpRequestStatus === 'success'
      ) {
        console.log('HERERE', state);
        const networkList = state.networkList.data;
        const userAccessedNetworks = state.userNetworkAccesses.data;

        // Extracting those networks which are not founded in userAccessedNetworks
        const noAccessNetworks =
          networkList && userAccessedNetworks
            ? networkList.filter(
                item =>
                  !userAccessedNetworks.find(acc => acc.network.id === item.id),
              )
            : [];

        setNoAccessNetworks(
          noAccessNetworks.map((item, index) => ({
            index: index + 1,
            network: item.name,
            select: false,
          })),
        );

        setAccessedNetworks(
          userAccessedNetworks
            ? userAccessedNetworks.map((item, index) => ({
                index: index + 1,
                network: item.network.name,
                select: false,
              }))
            : [],
        );
      }
    },
  });

  const handleNoAccessCheckboxClick = (index: number) => {
    noAccessSelected.includes(index)
      ? setNoAccessSelected(prvState => prvState.filter(item => item !== index))
      : setNoAccessSelected(prv => [...prv, index]);
  };

  console.log(noAccessNetworks, accessedNetworks);

  return (
    <div className="flex">
      <Table
        cols={columns}
        items={noAccessNetworks}
        dynamicColumns={['select']}
        renderDynamicColumn={({index}) => (
          <input
            type="checkbox"
            onClick={() => handleNoAccessCheckboxClick(index)}
            checked={noAccessSelected.includes(index)}
          />
        )}
      />
      <DoubleSideButtonGroup />
      <Table
        cols={columns}
        items={accessedNetworks}
        dynamicColumns={['select']}
        renderDynamicColumn={() => <input type="checkbox" />}
      />
    </div>
  );
};

export default NetworkEditAccessTable;
