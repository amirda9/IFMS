import {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {SimpleBtn, Table} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';

type Props = {
  userId: string;
  access: AccessEnum;
  setIsEditing?: Dispatch<SetStateAction<boolean>>;
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
  setIsEditing,
}) => {
  const [noAccessNetworks, setNoAccessNetworks] = useState<
    AccessNetworkTableItem[]
  >([]);
  const [accessedNetworks, setAccessedNetworks] = useState<
    AccessNetworkTableItem[]
  >([]);

  const [noAccessSelected, setNoAccessSelected] = useState<string[]>([]);
  const [accessedNetsSelected, setAccessedNetsSelected] = useState<string[]>(
    [],
  );

  const {
    request,
    state: {userUpdateAccesses, userNetworkAccesses, networkList},
  } = useHttpRequest({
    selector: state => ({
      networkList: state.http.networkList,
      userNetworkAccesses: state.http.userNetworkAccesses,
      userUpdateAccesses: state.http.userUpdateAccesses,
    }),
    clearAfterUnmount: ['userUpdateAccesses'],
    initialRequests: request => {
      request('networkList', undefined);
      request('userNetworkAccesses', {
        params: {user_id: userId},
        queryString: {access_type: access},
      });
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.userUpdateAccesses?.httpRequestStatus === 'loading' &&
        state.userUpdateAccesses?.httpRequestStatus === 'success'
      ) {
        request('userNetworkAccesses', {
          params: {user_id: userId},
          queryString: {access_type: access},
        });
        toast('Updated successfully!', {type: 'success'});
        return;
      } else if (state.userUpdateAccesses?.httpRequestStatus === 'error') {
        if (state.userUpdateAccesses.error?.status === 422) {
        } else {
          toast(
            (state.userUpdateAccesses.error?.data?.detail as string) ||
              'Unknown error.',
            {type: 'error'},
          );
        }
      }

      // We want to make sure we don't accidentally update the table items when the updating API is processing
      if (
        state.userUpdateAccesses?.httpRequestStatus !== 'loading' &&
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
    accessedNetsSelected.includes(item.id)
      ? setAccessedNetsSelected(prvState =>
          prvState.filter(id => id !== item.id),
        )
      : setAccessedNetsSelected(prv => [...prv, item.id]);
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
        accessedNetworks.filter(item => accessedNetsSelected.includes(item.id)),
      ),
    );
    setAccessedNetworks(prevState =>
      prevState.filter(item => !accessedNetsSelected.includes(item.id)),
    );
    setAccessedNetsSelected([]);
  };

  const handleSaveClick = () => {
    request('userUpdateAccesses', {
      params: {user_id: userId},
      queryString: {access_type: access, resource_type: 'NETWORK'},
      data: {ids: accessedNetworks.map(item => item.id)},
    });
  };

  return (
    <>
      <div className="flex flex-grow items-center gap-x-4">
        <Table
          cols={columns}
          items={noAccessNetworks}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleNoAccessCheckboxClick(value)}
              checked={noAccessSelected.includes(value.id)}
            />
          )}
          loading={
            userNetworkAccesses?.httpRequestStatus === 'loading' ||
            networkList?.httpRequestStatus === 'loading'
          }
        />
        <DoubleSideButtonGroup
          onClickRightButton={handleNetworkAddClick}
          onClickLeftButton={handleNetworkRemoveClick}
        />
        <Table
          cols={columns}
          items={accessedNetworks}
          dynamicColumns={['select']}
          renderDynamicColumn={({value}) => (
            <input
              type="checkbox"
              onChange={() => handleAccessedCheckboxClick(value)}
              checked={accessedNetsSelected.includes(value.id)}
            />
          )}
          loading={
            userNetworkAccesses?.httpRequestStatus === 'loading' ||
            networkList?.httpRequestStatus === 'loading'
          }
        />
      </div>
      <div className="flex gap-x-2 self-end">
        <SimpleBtn onClick={handleSaveClick}>Save</SimpleBtn>
        <SimpleBtn
          onClick={() => {
            if (typeof setIsEditing === 'function') setIsEditing(false);
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </>
  );
};

export default NetworkEditAccessTable;
