
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
import Checkbox from '~/components/checkbox/checkbox';
import { $Get } from '~/util/requestapi';
import { UserRole } from '~/constant/users';

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
  // const userList =
  //   users?.data?.map(user => ({
  //     user: user.username,
  //     region: user.region?.name || '-',
  //     station: user.station?.name || '-',
  //     id: user.id,
  //   })) || [];
   const [userList,setUserlist]=useState<{   id: string;
    username: string;
    name:string;
    email: string;
    role: UserRole;
    station?: {
      name: string;
    };
    region?: {
      name: string;
    }}[]>([])
  const [state, setState] = useState<StateType>({
    values: [],
    selectLeft:[],
    selectRight: [],
    group: false,
    Adminid:""
  });
  const getuserlist=async()=>{
    try {
      const listuser=await $Get(`auth/users/`)
      const listuserdata:any=await listuser.json()
      console.log("🎯",listuserdata);
      
      if(listuser.status == 200){
        setUserlist(listuserdata?.map((user:any) => ({
          user: user.username,
          region: user.region?.name || '-',
          station: user.station?.name || '-',
          id: user.id,
        })) || [])
      }
      setState(state =>({
        ...state,
        selectLeft:listuserdata.filter((userr:any) => state.values.includes(userr.id)).map((data:any)=>(data.id)),
      }));
    } catch (error) {
      
    }
 
  }
  useEffect(()=>{
   

    getuserlist()
  },[])
  
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
        
        setState({...state,selectLeft:userList.filter((userr:any) => state.values.includes(userr.id)).map((data:any)=>(data.id)), group: isGroup});
      },
    }),
    [state.values, state.group,state.Adminid],
  );





  console.log(state,'🦐');
  
  const changeSelect = (side: 'left' | 'right', id?: string) => (key?: any) => {
    console.log("🤢🤬",id);
    
    const allvalues = [...state.values];
    const index = allvalues.indexOf(id!);
    if(allvalues.indexOf(id!) > -1){
     
      allvalues.splice(index, 1);
    }else{
    
      allvalues.push(id!)
    }
    // setState({
    //   ...state,
    //   selectLeft: [],
    //   values: [...state.values, ...state.selectLeft],
    // });
    // setCange(!change);


    // const values = [...state.values];
    // state.selectRight.forEach(value => {
    //   const index = values.indexOf(value);
    //   values.splice(index, 1);
    // });
    // setState({...state, selectRight: [], values});
    // setCange(!change);

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
        values:allvalues,
        [side === 'left' ? 'selectLeft' : 'selectRight']: list,
      };
    });
  };

  const renderDynamicColumn = (side: 'left' | 'right') => {
    return ({value, key, index}: RenderDynamicColumnType) => {
      if (key === 'index') return index + 1;
      else
        return (
      <div className='w-full flex flex-row justify-center'>

<Checkbox
          checkstatus={
           state.selectLeft.includes(value.id)}
           onclick={changeSelect(side, value.id)}
        
          iconclassnam="ml-[1px] mt-[1px] text-[#18C047]"
          classname={
            ' border-[1px] text-[#18C047] border-[#000000]'
          }
        />
      </div>
          // <input
          //   type="checkbox"
          //   checked={(side === 'left'
          //     ? state.selectLeft
          //     : state.selectRight
          //   ).includes(value.id)}
          //   onChange={changeSelect(side, value.id)}
          // />
        );
    };
  };

  // const admin = groups?.data?.find(
  //   value => value.access === AccessEnum.admin,
  // );


  const group1 = groups?.data;

  const groupList =
    groups?.data?.map(group => {
      const users = group.users.map(user => ({
        label: `${user.username} - ${user.station?.name || '_'}`,
        value: user.id,
      }));

      return {
        label: group.name,
        items: users
        // .filter(item => !state.values.includes(item.value)),
      };
    }) || [];

  const Users:any = userList
  // .filter(user => !state.values.includes(user.id)) || [];

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



  const veiwers:any = userList.filter(user => state.values.includes(user.id)) || [];


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
          containerClassName="w-full h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
          cols={{groups: {label: 'Groups'}}}
          items={groupList}
          dynamicColumns={['groups']}
          renderDynamicColumn={({value}) => {
           console.log("🌻",value);
            return(
              <div className="px-4">
              <GroupItem
                items={value.items}
                label={value.label}
                onSelect={changeSelect('left')}
                selected={state.selectLeft}
              />
            </div>
            )
        
          }}
        />
      ) : (
        <Table
          loading={
            (groups?.httpRequestStatus !== 'success' && state.group) ||
            (users?.httpRequestStatus !== 'success' && !state.group)
          }
          tabicon={usertabselected}
          onclicktitle={(tabname: string, sortalfabet: boolean) => {
            setUsertabselected(tabname), setUsertablesort(sortalfabet);
          }}
          cols={columns}
          items={usersssorted.length > 0 ? usersssorted : Users.sort((a:any, b:any) => a.user.localeCompare(b.user, 'en-US'))}
          containerClassName="w-full h-[calc(100vh-260px)]  mr-[5px]  overflow-y-auto"
          dynamicColumns={['select', 'index']}
          renderDynamicColumn={renderDynamicColumn('left')}
        />
      )}

{/* {state.group ?
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
      />:null} */}
{/* 
{state.group ?
      <Table
        loading={
          (groups?.httpRequestStatus !== 'success' && state.group) ||
          (users?.httpRequestStatus !== 'success' && !state.group)
        }
        onclicktitle={(tabname: string, sortalfabet: boolean) => {
          setVeiwertabselected(tabname), setVeiwertablesort(sortalfabet);
        }}
        cols={columns}
        tabicon={veiwertabselected}
        items={veiwersssorted.length > 0 ? veiwersssorted : veiwers}
        containerClassName="w-[44%] h-[calc(100vh-260px)] ml-[5px]  overflow-y-auto"
        dynamicColumns={['select', 'index']}
        renderDynamicColumn={renderDynamicColumn('right')}
      />:null} */}
    </div>
  );
});

export default EditViewers;
