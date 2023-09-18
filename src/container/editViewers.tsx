import React, {FC, forwardRef, useImperativeHandle, useState} from 'react';
import {useHttpRequest} from '~/hooks';
import {GroupItem, SimpleBtn, Table, TallArrow} from '~/components';
import DoubleSideButtonGroup from '~/components/buttons/DoubleSideButtonGroup';

type UserTableType = {
  id: string;
  user: string;
  region: string;
  station: string;
};
type StateType = {
  values: string[];
  selectLeft: string[];
  selectRight: string[];
  group: boolean;
};
const columns = {
  select: {label: '', size: 'w-[6%]'},
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[28%]', sort: true},
  region: {label: 'Region', size: 'w-[28%]'},
  station: {label: 'Station', size: 'w-[28%]'},
};

type RenderDynamicColumnType = {
  index: number;
  value: UserTableType;
  key: 'index' | 'select';
};
export type EditorRefType = {
  values: string[];
  setValues: (values: string[]) => void;
  group: boolean;
  setGroup: (isGroup: boolean) => void;
};
const EditViewers = forwardRef<EditorRefType>((_, ref) => {
  const [state, setState] = useState<StateType>({
    values: [],
    selectLeft: [],
    selectRight: [],
    group: false,
  });

  const {
    state: {users, groups},
    request,
  } = useHttpRequest({
    selector: state => ({
      users: state.http.userList,
      groups: state.http.groupList,
    }),
    initialRequests: request => {
      request('userList', undefined);
    },
  });

  useImperativeHandle(
    ref,
    () => ({
      values: state.values,
      group: state.group,
      setValues: (values: string[]) => {
        setState({...state, values});
      },
      setGroup: (isGroup: boolean) => {
        if (isGroup && !groups?.data) {
          request('groupList', undefined);
        }
        setState({...state, group: isGroup});
      },
    }),
    [state.values, state.group],
  );

  const changeSelect = (side: 'left' | 'right', id?: string) => (key?: any) => {
    setState(state => {
      const list = [
        ...(side === 'left' ? state.selectLeft : state.selectRight),
      ];
      if (list.includes(id ?? key)) {
        const index = list.indexOf(id ?? key);
        list.splice(index, 1);
      } else {
        list.push(id ?? key);
      }
      return {
        ...state,
        [side === 'left' ? 'selectLeft' : 'selectRight']: list,
      };
    });
  };
  const renderDynamicColumn = (side: 'left' | 'right') => {
    return ({value, key, index}: RenderDynamicColumnType) => {
      if (key === 'index') return index + 1;
      else
        return (
          <input
            type="checkbox"
            checked={(side === 'left'
              ? state.selectLeft
              : state.selectRight
            ).includes(value.id)}
            onChange={changeSelect(side, value.id)}
          />
        );
    };
  };

  const userList =
    users?.data?.map(user => ({
      user: user.username,
      region: user.region?.name || '-',
      station: user.station?.name || '-',
      id: user.id,
    })) || [];

  const groupList =
    groups?.data?.map(group => {
      const users = group.users.map(user => ({
        label: `${user.username} - ${user.station?.name || '_'}`,
        value: user.id,
      }));
      return {
        label: group.name,
        items: users.filter(item => !state.values.includes(item.value)),
      };
    }) || [];

  return (
    <div className="flex h-full w-full flex-row items-center justify-between">
      {state.group ? (
        <Table
          keyExtractor={value => value.label}
          containerClassName="w-[44%] h-full"
          cols={{groups: {label: 'Groups'}}}
          items={groupList}
          dynamicColumns={['groups']}
          renderDynamicColumn={({value}) => (
            <div className="px-4">
              <GroupItem
                items={value.items}
                label={value.label}
                onSelect={changeSelect('left')}
                selected={state.selectLeft}
              />
            </div>
          )}
        />
      ) : (
        <Table
          loading={
            (groups?.httpRequestStatus !== 'success' && state.group) ||
            (users?.httpRequestStatus !== 'success' && !state.group)
          }
          cols={columns}
          items={userList.filter(user => !state.values.includes(user.id))}
          containerClassName="w-[44%] h-[775px]"
          dynamicColumns={['select', 'index']}
          renderDynamicColumn={renderDynamicColumn('left')}
        />
      )}

      <DoubleSideButtonGroup
        onClickRightButton={() => {
          setState({
            ...state,
            selectLeft: [],
            values: [...state.values, ...state.selectLeft],
          });
        }}
        onClickLeftButton={() => {
          const values = [...state.values];
          state.selectRight.forEach(value => {
            const index = values.indexOf(value);
            values.splice(index, 1);
          });
          setState({...state, selectRight: [], values});
        }}
      />

      <Table
        loading={
          (groups?.httpRequestStatus !== 'success' && state.group) ||
          (users?.httpRequestStatus !== 'success' && !state.group)
        }
        cols={columns}
        items={userList.filter(user => state.values.includes(user.id))}
        containerClassName="w-[44%] h-[775px]"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('right')}
      />
    </div>
  );
});

export default EditViewers;
