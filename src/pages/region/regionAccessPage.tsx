import React, {useMemo, useState} from 'react';
import {Description, Select, SimpleBtn, Table} from '~/components';
import {useParams} from 'react-router-dom';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {FormLayout} from '~/layout';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const RegionAccessPage = () => {
  const params = useParams<{regionId: string}>();
  const [userAdmin, setUserAdmin] = useState<string | undefined>();
  const {
    request,
    state: {viewers, users, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.regionAccessList,
      users: state.http.userList,
      update: state.http.regionAdminUpdate,
    }),
    initialRequests: request => {
      request('regionAccessList', {params: {region_id: params.regionId!}});
      request('userList', undefined);
    },
  });
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
    request('regionAdminUpdate', {
      params: {region_id: params.regionId!},
      data: {user_id: userAdmin || admin!.user.id!},
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
    return (
      <>
        <Description label="Region Admin" className="mb-4">
          <Select
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
        <Description label="Region Viewers(s)" items="start" className="h-full">
          <Table
            loading={viewers?.httpRequestStatus === 'loading'}
            cols={columns}
            items={items}
            width="w-3/5"
          />
        </Description>
      </>
    );
  }, [viewers?.httpRequestStatus, users?.httpRequestStatus, userAdmin]);
  const buttons = (
    <>
      <SimpleBtn link to="../edit-access">
        Edit Region Viewer(s)
      </SimpleBtn>
      <SimpleBtn
        onClick={saveAdmin}
        disabled={update?.httpRequestStatus === 'loading'}>
        Save
      </SimpleBtn>
      <SimpleBtn link to="../">
        Cancel
      </SimpleBtn>
    </>
  );
  return <FormLayout buttons={buttons}>{body}</FormLayout>;
};

export default RegionAccessPage;
