import React, {useMemo, useState} from 'react';
import {GroupItem, SimpleBtn, Switch, Table, TallArrow} from '~/components';
import {FormLayout} from '~/layout';
import {useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {AccessCreateType, AccessEnum} from '~/types';

const columns = {
  select: {label: '', size: 'w-[6%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[28%]', sort: true},
  region: {label: 'Region', size: 'w-[28%]'},
  station: {label: 'Station', size: 'w-[28%]'},
};

const dummyGroupItems = [
  {label: 'USER1-Station1', value: 1},
  {label: 'USER1-Station1', value: 2},
  {label: 'USER1-Station1', value: 3},
  {label: 'USER1-Station1', value: 4},
  {label: 'USER1-Station1', value: 5},
  {label: 'USER1-Station1', value: 6},
];
const groups = [
  {label: 'Group1', items: dummyGroupItems},
  {label: 'Group2', items: dummyGroupItems},
  {label: 'Group3', items: dummyGroupItems},
  {label: 'Group4', items: dummyGroupItems},
];

type UserTableType = {
  id: string;
  user: string;
  region: string;
  station: string;
};
type StateType = {
  switch: boolean;
  selectedUser: Record<string, UserTableType>;
  movedToUser: Record<string, UserTableType>;
  movedToViewer: Record<string, UserTableType>;
  selectedViewer: Record<string, UserTableType>;
};
const NetworkAccessPage = () => {
  const params = useParams<{networkId: string}>();
  const [state, setState] = useState<StateType>({
    switch: false,
    selectedUser: {},
    selectedViewer: {},
    movedToUser: {},
    movedToViewer: {},
  });
  const {
    request,
    state: {viewers, users, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.networkAccessList,
      users: state.http.userList,
      update: state.http.networkAccessUpdate,
    }),
    initialRequests: request => {
      request('networkAccessList', {params: {network_id: params.networkId!}});
      request('userList', undefined);
    },
  });
  const saveViewer = () => {
    const viewerList =
      viewers?.httpRequestStatus === 'success' ? [...viewers!.data!.users] : [];
    const viewerAdmin = viewerList.find(
      viewer => viewer.access === AccessEnum.admin,
    );

    const viewersList: AccessCreateType[] = [
      ...viewerList.map(viewer => viewer.user.id),
      ...Object.keys(state.movedToViewer),
    ]
      .filter(
        value =>
          !(value in state.movedToUser) && value !== viewerAdmin?.user.id,
      )
      .map(value => ({user_id: value, access_types: AccessEnum.viewer}));

    request('networkAccessUpdate', {
      params: {network_id: params.networkId!},
      data: {
        users: [
          {access_types: AccessEnum.admin, user_id: viewerAdmin!.user.id},
          ...viewersList,
        ],
      },
    });
  };
  const buttons = (
    <>
      <SimpleBtn
        onClick={saveViewer}
        disabled={update?.httpRequestStatus === 'loading'}>
        OK
      </SimpleBtn>
      <SimpleBtn>Cancel</SimpleBtn>
    </>
  );

  const body = useMemo(() => {
    const viewerList =
      viewers?.httpRequestStatus === 'success' ? [...viewers!.data!.users] : [];
    const userList =
      users?.httpRequestStatus === 'success' ? [...users!.data!] : [];
    const viewerAdminIndex = viewerList.findIndex(
      viewer => viewer.access === AccessEnum.admin,
    );
    if (viewerAdminIndex !== -1) {
      const userAdminIndex = userList.findIndex(
        user => user.id === viewerList[viewerAdminIndex!].user.id,
      );
      viewerList.splice(viewerAdminIndex, 1);
      if (userAdminIndex !== -1) {
        userList.splice(userAdminIndex, 1);
      }
    }
    const viewerIds = Object.keys(state.movedToViewer);
    const userIds = Object.keys(state.movedToUser);

    const viewerListWithoutAdmin = [
      ...viewerList.map(value => {
        viewerIds.push(value.user.id);
        return {
          id: value.user.id,
          user: value.user.username,
          region: value.user.region?.name || '-',
          station: value.user.station?.name || '-',
        };
      }),
      ...Object.values(state.movedToViewer),
    ].filter(item => !userIds.includes(item.id));

    const userListWithoutAdmin = [
      ...userList
        .map(value => ({
          id: value.id,
          user: value.username,
          region: value.region?.name || '-',
          station: value.station?.name || '-',
        }))
        .filter(user => !userIds.includes(user.id)),
      ...Object.values(state.movedToUser),
    ].filter(value => !viewerIds.includes(value.id));

    return (
      <div className="flex h-full w-full flex-row items-center justify-between">
        {state.switch ? (
          <Table
            width="w-[44%]"
            cols={{groups: {label: 'Groups'}}}
            items={groups}
            dynamicColumns={['groups']}
            renderDynamicColumn={({value}) => (
              <div className="px-4">
                <GroupItem items={value.items} label={value.label} />
              </div>
            )}
          />
        ) : (
          <Table
            cols={columns}
            items={userListWithoutAdmin}
            width="w-[44%]"
            dynamicColumns={['select', 'index']}
            renderDynamicColumn={({value, key, index}) =>
              key === 'index' ? (
                index + 1
              ) : (
                <input
                  type="checkbox"
                  checked={value.id in state.selectedUser}
                  onChange={() => {
                    const recordSelectedUser = {...state.selectedUser};
                    if (value.id in recordSelectedUser) {
                      delete recordSelectedUser[value.id];
                    } else {
                      recordSelectedUser[value.id] = value;
                    }
                    setState({...state, selectedUser: recordSelectedUser});
                  }}
                />
              )
            }
          />
        )}
        <div className="flex flex-col items-center">
          <SimpleBtn
            className="!w-28"
            onClick={() => {
              const movedToUser = {...state.movedToUser};
              Object.keys(state.selectedUser).forEach(value => {
                if (value in movedToUser) {
                  delete movedToUser[value];
                }
              });
              setState({
                ...state,
                movedToUser,
                selectedUser: {},
                movedToViewer: {...state.selectedUser, ...state.movedToViewer},
              });
            }}>
            Add
          </SimpleBtn>
          <TallArrow className="mt-7" />
          <TallArrow className="mb-7 mt-14 rotate-180" />
          <SimpleBtn
            className="!w-28"
            onClick={() => {
              const movedToViewer = {...state.movedToViewer};
              Object.keys(state.selectedViewer).forEach(value => {
                if (value in movedToViewer) {
                  delete movedToViewer[value];
                }
              });
              setState({
                ...state,
                movedToViewer,
                selectedViewer: {},
                movedToUser: {...state.selectedViewer, ...state.movedToUser},
              });
            }}>
            Remove
          </SimpleBtn>
        </div>
        <Table
          cols={columns}
          items={viewerListWithoutAdmin}
          width="w-[44%]"
          dynamicColumns={['select', 'index']}
          renderDynamicColumn={({index, value, key}) =>
            key === 'index' ? (
              index + 1
            ) : (
              <input
                type="checkbox"
                checked={value.id in state.selectedViewer}
                onChange={() => {
                  const recordSelectedViewer = {...state.selectedViewer};
                  if (value.id in recordSelectedViewer) {
                    delete recordSelectedViewer[value.id];
                  } else {
                    recordSelectedViewer[value.id] = value;
                  }
                  setState({...state, selectedViewer: recordSelectedViewer});
                }}
              />
            )
          }
        />
      </div>
    );
  }, [state, users?.httpRequestStatus, viewers?.httpRequestStatus]);

  return (
    <FormLayout buttons={buttons} wrapperClassName="p-8">
      <div className="mb-4 flex flex-row items-center">
        <span>Users</span>
        <Switch
          wrapperClassName="mx-5"
          onChange={value => {
            setState({...state, switch: value});
          }}
          checked={state.switch}
        />
        <span>Groups</span>
      </div>
      {body}
    </FormLayout>
  );
};

export default NetworkAccessPage;
