import {FC, useState} from 'react';
import {toast} from 'react-toastify';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import EditAccessTablesView from './EditAccessTablesView';
import {useNavigate} from 'react-router-dom';

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
  id: string;
};

const NetworkEditAccessTable: FC<Props> = ({
  userId,
  access = AccessEnum.admin,
}) => {
  const navigate = useNavigate();

  const [noAccessNetworks, setNoAccessNetworks] = useState<
    AccessNetworkTableItem[]
  >([]);
  const [accessedNetworks, setAccessedNetworks] = useState<
    AccessNetworkTableItem[]
  >([]);

  const [noAccessSelected, setNoAccessSelected] = useState<string[]>([]);
  const [accessedSelected, setAccessedSelected] = useState<string[]>([]);

  const {
    request,
    state: {updateUserNetworkAccesses, userNetworkAccesses, networkList},
  } = useHttpRequest({
    selector: state => ({
      networkList: state.http.networkList,
      userNetworkAccesses: state.http.userNetworkAccesses,
      updateUserNetworkAccesses: state.http.updateUserNetworkAccesses,
    }),
    clearAfterUnmount: ['updateUserNetworkAccesses'],
    initialRequests: request => {
      request('networkList', undefined);
      request('userNetworkAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.updateUserNetworkAccesses?.httpRequestStatus === 'loading' &&
        state.updateUserNetworkAccesses?.httpRequestStatus === 'success'
      ) {
        toast('Updated successfully!', {type: 'success'});
        navigate('../access');
        return;
      } else if (
        state.updateUserNetworkAccesses?.httpRequestStatus === 'error'
      ) {
        if (state.updateUserNetworkAccesses.error?.status === 422) {
        } else {
          toast(
            (state.updateUserNetworkAccesses.error?.data?.detail as string) ||
              'Unknown error.',
            {type: 'error'},
          );
        }
      }

      // We want to make sure we don't accidentally update the table items when the updating API is processing
      if (
        state.updateUserNetworkAccesses?.httpRequestStatus !== 'loading' &&
        state.userNetworkAccesses?.httpRequestStatus === 'success'
      ) {
        const userAccessedNetworks = state.userNetworkAccesses.data;
        setAccessedNetworks(
          userAccessedNetworks
            ? userAccessedNetworks.map((item, index) => ({
                index: index + 1,
                network: item.network.name,
                select: false,
                id: item.network.id,
              }))
            : [],
        );

        if (state.networkList?.httpRequestStatus === 'success') {
          const networkList = state.networkList.data;

          // Extracting those networks which are not founded in userAccessedNetworks
          const noAccessNetworks =
            networkList && userAccessedNetworks
              ? networkList.filter(
                  item =>
                    !userAccessedNetworks.find(
                      acc => acc.network.id === item.id,
                    ),
                )
              : [];

          setNoAccessNetworks(
            noAccessNetworks.map((item, index) => ({
              index: index + 1,
              network: item.name,
              select: false,
              id: item.id,
            })),
          );
        }
      }
    },
  });

  const handleNoAccessCheckboxClick = (item: AccessNetworkTableItem) => {
    noAccessSelected.includes(item.id)
      ? setNoAccessSelected(prvState => prvState.filter(id => id !== item.id))
      : setNoAccessSelected(prv => [...prv, item.id]);
  };

  const handleAccessedCheckboxClick = (item: AccessNetworkTableItem) => {
    accessedSelected.includes(item.id)
      ? setAccessedSelected(prvState => prvState.filter(id => id !== item.id))
      : setAccessedSelected(prv => [...prv, item.id]);
  };

  const handleNetworkAddClick = () => {
    setAccessedNetworks(prevState =>
      prevState.concat(
        noAccessNetworks.filter(item => noAccessSelected.includes(item.id)),
      ),
    );
    setNoAccessNetworks(prevState =>
      prevState.filter(item => !noAccessSelected.includes(item.id)),
    );
    setNoAccessSelected([]);
  };

  const handleNetworkRemoveClick = () => {
    setNoAccessNetworks(prevState =>
      prevState.concat(
        accessedNetworks.filter(item => accessedSelected.includes(item.id)),
      ),
    );
    setAccessedNetworks(prevState =>
      prevState.filter(item => !accessedSelected.includes(item.id)),
    );
    setAccessedSelected([]);
  };

  const handleSaveClick = () => {
    request('updateUserNetworkAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access},
      data: {ids: accessedNetworks.map(item => item.id)},
    });
  };

  return (
    <EditAccessTablesView
      tableColumns={columns}
      accessedItems={accessedNetworks}
      noAccessItems={noAccessNetworks}
      accessedSelected={accessedSelected}
      noAccessSelected={noAccessSelected}
      handleAddClick={handleNetworkAddClick}
      handleRemoveClick={handleNetworkRemoveClick}
      handleAccessedCheckboxClick={handleAccessedCheckboxClick}
      handleNoAccessCheckboxClick={handleNoAccessCheckboxClick}
      handleSaveClick={handleSaveClick}
      accessedTableLoading={
        userNetworkAccesses?.httpRequestStatus === 'loading' ||
        networkList?.httpRequestStatus === 'loading'
      }
      noAccessTableLoading={
        userNetworkAccesses?.httpRequestStatus === 'loading' ||
        networkList?.httpRequestStatus === 'loading'
      }
    />
  );
};

export default NetworkEditAccessTable;
