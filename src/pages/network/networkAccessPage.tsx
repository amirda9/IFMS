import React, {useEffect, useMemo, useState} from 'react';
import {Description, Select, SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {useParams} from 'react-router-dom';
import {FormLayout} from '~/layout';
import Cookies from 'js-cookie';
import {BASE_URL, networkExplored} from '~/constant';
import {useSelector} from 'react-redux';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const NetworkAccessPage = () => {
  const login = localStorage.getItem('login');
  const accesstoken=JSON.parse(login || "")?.data.access_token
  const [userrole,setuserrole]=useState<any>("")
  const getrole=async()=>{
    const role=await fetch(`${BASE_URL}/auth/users/token/verify_token`,{
      headers: {
        Authorization:`Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json'},
    }).then(res =>res.json())
    setuserrole(role.role)

  }
useEffect(()=>{
  getrole()
},[])
  const {networkDetail} = useSelector((state: any) => state.http);
  console.log(networkDetail.data.access, '😋');
  const params = useParams<{networkId: string}>();
  const [userAdmin, setUserAdmin] = useState<string | undefined>();
  const {
    request,
    state: {viewers, users, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.networkAccessList,
      users: state.http.userList,
      update: state.http.networkUpdateAdmin,
    }),
    initialRequests: request => {
      request('networkAccessList', {params: {network_id: params.networkId!}});
      request('userList', undefined);
    },
  });
  // console.log(viewers, 'viewers');
  // console.log(users, 'users');
  // console.log(update, 'update');
console.log(viewers,'viewersviewers');

  const saveAdmin = () => {
    const admin = viewers?.data?.users.find(
      viewer => viewer.access === AccessEnum.admin,
    );
    request('networkUpdateAdmin', {
      params: {network_id: params.networkId!},
      data: {user_id: userAdmin || admin!.user.id},
    });
  };

  const body = useMemo(() => {
    const items = (viewers?.data?.users || [])
      .filter(value => value.access !== AccessEnum.admin)
      .map((value, index) => ({
        index: (index + 1).toString(),
        user: value.user.username,
        station: value.user.station?.name || '-',
        region: value.user.region?.name || '-',
      }));
    const admin = viewers?.data?.users.find(
      viewer => viewer.access === AccessEnum.admin,
    );
    const ifUserExist = users?.data?.some(user => user.id === admin?.user.id);
    const userList =
      users?.httpRequestStatus === 'success' ? [...users.data!] : [];
    if (!ifUserExist && admin) {
      userList.push({...admin.user});
    }
    console.log(viewers,'viewers');
    
    return (
      <>
        <Description label="Network Admin" className="mb-4">
          <Select
          disabled={userrole == 'superuser' || networkDetail.data.access.role == "superuser"?false:true}
            className="w-80"
            value={userAdmin || admin?.user.id}
            onChange={event => {
              setUserAdmin(event.target.value);
            }}>
            <option value="" className="hidden" />
            <option value={undefined} className="hidden" />
            {userList.map(user => (
              <option value={user.id} key={user.id}>
                {user.username}
              </option>
            ))}
          </Select>
        </Description>
        <Description label="Network Viewer(s)" items="start" className="h-full">
          <Table
            loading={viewers?.httpRequestStatus === 'loading'}
            cols={columns}
            items={items}
            containerClassName="w-3/5 mt-[-7px]"
          />
        </Description>
      </>
    );
  }, [viewers?.httpRequestStatus, users?.httpRequestStatus, userAdmin]);

  const buttons = (
    <>
      {userrole == 'superuser' || networkDetail.data.access.access == 'ADMIN' ? (
        <SimpleBtn link to="../edit-access">
          Edit Network Viewer(s)
        </SimpleBtn>
      ) : null}

      <SimpleBtn
        onClick={() => {
          Cookies.set(networkExplored, params.networkId!);
        }}>
        Explore
      </SimpleBtn>
      <SimpleBtn link to="../history">
        History
      </SimpleBtn>
      {userrole == 'superuser' || networkDetail.data.access.access == 'ADMIN'?
          <SimpleBtn
          onClick={saveAdmin}
          disabled={update?.httpRequestStatus === 'loading'}>
          Save
        </SimpleBtn>
      :null}
  
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  return <FormLayout buttons={buttons}>{body}</FormLayout>;
};

export default NetworkAccessPage;
