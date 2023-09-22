import React from 'react';
import {useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
import {Description, Select, SimpleBtn, Table} from '~/components';
import { useHttpRequest } from '~/hooks';
import { AccessEnum } from '~/types';

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
  console.log(viewers,'viewers');
  console.log(users,'users');
  console.log(items,'items');

  const {linkDetail} = useSelector((state: any) => state.http);
  console.log(linkDetail?.data?.access, 'fffrrtttt');
  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <Description label="Link Admin" className="mb-4">
          <Select className="w-80 text-sm">
            <option>ahmad kazemi</option>
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
        {linkDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn link to="../edit-access">
            Edit Link Viewer(s)
          </SimpleBtn>
        ) : null}
        <SimpleBtn>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default LinkAccessPage;
