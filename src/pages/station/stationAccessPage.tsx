import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Description, Select, SimpleBtn, Table} from '~/components';
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
const StationAccessPage = () => {
  const params = useParams<{stationId: string}>();
  const [userAdmin, setUserAdmin] = useState<string | undefined>();
  const {stationDetail} = useSelector((state: any) => state.http);
  console.log(stationDetail, 'stationDetail');
  const {
    request,
    state: {viewers, users},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.stationAccessList,
      users: state.http.userList,
    }),
    initialRequests: request => {
      request('stationAccessList', {params: {station_id: params.stationId!}});
     request('userList', undefined);
    },
  });
  console.log(viewers, 'viewersvviewers');
  console.log(users, 'users');
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
  console.log(items, 'items');

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
    request('stationAddadmin', {
      params: {station_id: params.stationId!},
      data: {user_id: userAdmin || admin!.user.id!},
    });
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Description label="Station Admin" className="mb-4">
          <Select onChange={e => setUserAdmin(e.target.value)} className="w-80">
          {userList.map(user => (
              <option value={user.id} key={user.id}>
                {user.username}
              </option>
            ))}
          </Select>
        </Description>
        <Description label="Station Viewer(s)" items="start" className="h-full">
          <Table
            cols={columns}
            items={items}
            containerClassName="w-3/5 mt-[-6px]"
          />
        </Description>
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        {stationDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn link to="../edit-access">
            Edit Station Viewer(s)
          </SimpleBtn>
        ) : null}
        {stationDetail?.data?.access == 'ADMIN' ? (
          <SimpleBtn onClick={saveAdmin}>Save</SimpleBtn>
        ) : null}
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default StationAccessPage;
