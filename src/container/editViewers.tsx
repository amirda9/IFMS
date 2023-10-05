import React, {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
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
  Adminid:string
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
  setAdminid:(values:string) => void;
};
const EditViewers = forwardRef<EditorRefType>((_, ref) => {
  const [state, setState] = useState<StateType>({
    values: [],
    selectLeft: [],
    selectRight: [],
    group: false,
    Adminid:""
  });

  
  const [mount, setmount] = useState(false);
  const [usertabselected, setUsertabselected] = useState('User');
  const [veiwertabselected, setVeiwertabselected] = useState('User');
  const [usertablesorte, setUsertablesort] = useState(false);
  const [veiwertablesorte, setVeiwertablesort] = useState(false);
  const [change, setCange] = useState(false);
  const [usersssorted, setUserssorted] = useState<
    {
      id: string;
      user: string;
      station: string;
      region: string;
    }[]
  >([]);
  const [veiwersssorted, setWeiverssorted] = useState<
    {
      id: string;
      user: string;
      station: string;
      region: string;
    }[]
  >([]);

 

  useImperativeHandle(
    ref,
    () => ({
      values: state.values,
      group: state.group,
      
      setValues: (values: string[]) => {
        setState({...state, values});
      },
      setAdminid:(values: string)=>{
        setState({...state, Adminid:values});
      },
      setGroup: (isGroup: boolean) => {
        if (isGroup && !groups?.data) {
          request('groupList', undefined);
        }
        setState({...state, group: isGroup});
      },
    }),
    [state.values, state.group,state.Adminid],
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

  // const admin = groups?.data?.find(
  //   value => value.access === AccessEnum.admin,
  // );
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
  const userList =
    users?.data?.map(user => ({
      user: user.username,
      region: user.region?.name || '-',
      station: user.station?.name || '-',
      id: user.id,
    })) || [];


  const group1 = groups?.data;

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

  const Users = userList.filter(user => !state.values.includes(user.id)) || [];

  const sortdusers = (tabname: string, sortalfabet: boolean) => {
    if (tabname != 'Index') {
      if (sortalfabet) {
        Users.sort(
          (a: any, b: any) =>
            -a[tabname.toLocaleLowerCase()].localeCompare(
              b[tabname.toLocaleLowerCase()],
              'en-US',
            ),
        );
      } else {
        Users.sort((a: any, b: any) =>
          a[tabname.toLocaleLowerCase()].localeCompare(
            b[tabname.toLocaleLowerCase()],
            'en-US',
          ),
        );
      }
      setUserssorted(Users);
    }
  };



  const veiwers = userList.filter(user => state.values.includes(user.id)) || [];

  for (let i=0;i<veiwers.length;i++){
    // const findusers=state.Viewers?.findIndex(data =>data.user.id == veiwers[i].id);
    
  if(veiwers[i].id == state.Adminid){
  veiwers.splice(i,1)
  }
  }


  const sortdveiwers = (tabname: string, sortalfabet: boolean) => {
    if (tabname != 'Index') {
      if (sortalfabet) {
        veiwers.sort(
          (a: any, b: any) =>
            -a[tabname.toLocaleLowerCase()].localeCompare(
              b[tabname.toLocaleLowerCase()],
              'en-US',
            ),
        );
      } else {
        veiwers.sort((a: any, b: any) =>
          a[tabname.toLocaleLowerCase()].localeCompare(
            b[tabname.toLocaleLowerCase()],
            'en-US',
          ),
        );
      }
      setWeiverssorted(veiwers);
    }
  };

  useEffect(() => {
    if (mount) {
      if (usertabselected != 'Index') {
        sortdusers(usertabselected, usertablesorte);
      }
    } 
  }, [
    usertabselected,
    usertablesorte,
    change,
  ]);

useEffect(()=>{
  if (mount) {
    if (veiwertabselected != 'Index') {
      sortdveiwers(veiwertabselected, veiwertablesorte);
    }
  } 
  setmount(true);
},[veiwertablesorte,veiwertabselected,change])

  return (
    <div className="mb-2 flex  h-full w-full flex-row items-center justify-between">
      {state.group ? (
        <Table
          keyExtractor={value => value.label}
          containerClassName="w-[44%] h-[calc(100vh-260px)]  mr-[5px] overflow-y-auto"
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
          tabicon={'User'}
          onclicktitle={(tabname: string, sortalfabet: boolean) => {
            setUsertabselected(tabname), setUsertablesort(sortalfabet);
          }}
          cols={columns}
          items={usersssorted.length > 0 ? usersssorted : Users.sort((a, b) => a.user.localeCompare(b.user, 'en-US'))}
          containerClassName="w-[44%] h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
          dynamicColumns={['select', 'index']}
          renderDynamicColumn={renderDynamicColumn('left')}
        />
      )}

      <DoubleSideButtonGroup
        onClickRightButton={() => {
          // if(parentname == "networkaccess"){

          // }
          setState({
            ...state,
            selectLeft: [],
            values: [...state.values, ...state.selectLeft],
          });
          setCange(!change);
        }}
        onClickLeftButton={() => {
          const values = [...state.values];
          state.selectRight.forEach(value => {
            const index = values.indexOf(value);
            values.splice(index, 1);
          });
          setState({...state, selectRight: [], values});
          setCange(!change);
        }}
      />

      <Table
        loading={
          (groups?.httpRequestStatus !== 'success' && state.group) ||
          (users?.httpRequestStatus !== 'success' && !state.group)
        }
        onclicktitle={(tabname: string, sortalfabet: boolean) => {
          setVeiwertabselected(tabname), setVeiwertablesort(sortalfabet);
        }}
        cols={columns}
        tabicon={'User'}
        items={veiwersssorted.length > 0 ? veiwersssorted : veiwers}
        containerClassName="w-[44%] h-[calc(100vh-260px)] ml-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('right')}
      />
    </div>
  );
});

export default EditViewers;
