import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Description, Select, SimpleBtn, Table} from '~/components';
import {BASE_URL} from '~/constant';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
const dummy = [
  {index: 1, user: 'USER1', region: 'Region', station: 'Station'},
  {index: 2, user: 'USER2', region: 'Region', station: 'Station'},
  {index: 3, user: 'USER3', region: 'Region', station: 'Station'},
  {index: 4, user: 'USER4', region: 'Region', station: 'Station'},
  {index: 5, user: 'USER5', region: 'Region', station: 'Station'},
  {index: 6, user: 'USER6', region: 'Region', station: 'Station'},
];
const LinkAccessPage = () => {
  const {regionDetail,networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<any>('');
  const getrole = async () => {
    const role = await fetch(`${BASE_URL}/auth/users/token/verify_token`, {
      headers: {
        Authorization: `Bearer ${accesstoken}`,
        Accept: 'application.json',
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
    setuserrole(role.role);
  };
  useEffect(() => {
    getrole();
  }, []);
  const [userAdmin, setUserAdmin] = useState<string | undefined>();
  const params = useParams<{linkId: string}>();
  const {
    request,
    state: {viewers, users},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.linkAccessList,
      users: state.http.userList,
    }),
    initialRequests: request => {
      request('linkAccessList', {params: {link_id: params.linkId!}});
      request('userList', undefined);
    },
  });
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
  // console.log(viewers, 'viewers');
  // console.log(users, 'users');
  // console.log(items, 'items');

  const {linkDetail} = useSelector((state: any) => state.http);
  const saveAdmin = () => {
    const viewerWithoutAdmin =
      viewers?.data?.users
        .filter(viewer => viewer.access !== AccessEnum.admin)
        .map(viewer => ({
          user_id: viewer.user.id,
          access_types: AccessEnum.viewer,
        })) || [];
    const admin = viewers?.data?.users.find(
      viewer => viewer.access === AccessEnum.admin,
    );
    viewerWithoutAdmin.push({
      user_id: userAdmin || admin!.user.id,
      access_types: AccessEnum.admin,
    });
    request('linkAddadmin', {
      params: {link_id: params.linkId!},
      data: {user_id: userAdmin || admin!.user.id!},
    });
  };

  console.log(linkDetail?.data?.access, '👨');
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Description label="Link Admin" className="mb-4">
          <Select
          value={userAdmin || admin?.user.id}
          disabled={userrole == 'superuser' ||
          linkDetail?.data?.access.role == 'superuser' || networkDetail?.data?.access?.access == 'ADMIN'?false:true}
            onChange={e => setUserAdmin(e.target.value)}
            className="w-80 text-sm">
            {userList.map(user => (
              <option onClick={() => alert('kk')} value={user.id} key={user.id}>
                {user.username}
              </option>
            ))}
          </Select>
        </Description>
        <Description
          label="Link Viewer(s)"
          items="start"
          className="h-full text-sm">
          <Table
            cols={columns}
            items={items}
            containerClassName="w-3/5 mt-[-5px]"
          />
        </Description>
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        {userrole == 'superuser' ||
        linkDetail?.data?.access.access == 'ADMIN' || networkDetail?.data?.access?.access == 'ADMIN'? (
          <SimpleBtn link to="../edit-access">
            Edit Link Viewer(s)
          </SimpleBtn>
        ) : null}
        {userrole == 'superuser' ||
        linkDetail?.data?.access.access == 'ADMIN' || networkDetail?.data?.access?.access == 'ADMIN' ? (
          <SimpleBtn onClick={saveAdmin}>Save</SimpleBtn>
        ) : null}

        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkAccessPage;
