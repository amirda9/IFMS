import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Description, Select, SimpleBtn, Table} from '~/components';
import {BASE_URL} from '~/constant';
import {useHttpRequest} from '~/hooks';
import { setstationviewers } from '~/store/slices/networkslice';
import {AccessEnum} from '~/types';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const StationAccessPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [tabname, setTabname] = useState('User');
  const dispatch = useDispatch();
  const [itemssorted, setItemssorted] = useState<
    {
      index: string;
      user: string;
      station: string;
      region: string;
    }[]
  >([]);
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
  const params = useParams<{stationId: string}>();
  const [userAdmin, setUserAdmin] = useState<string | undefined>();
  const {http, network} = useSelector((state: any) => state);
  // const {network} = useSelector((state: any) => state);

  const {
    request,
    state: {viewers, users, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.stationAccessList,
      users: state.http.userList,
      update: state.http.stationAccessUpdate,
    }),
    initialRequests: request => {
      request('stationAccessList', {params: {station_id: params.stationId!}});
      request('userList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('stationAccessList', {params: {station_id: params.stationId!}});
      }
    },
  });

  console.log(users, 'users💋');

  console.log(network?.stationviewers, '😵‍💫');

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
    request('stationAccessUpdate', {
      params: {station_id: params.stationId!},
      data: {users: network?.stationviewers},
    });
    dispatch(setstationviewers([])) 
  };

  const body = useMemo(() => {
    // const dataa = [];
    // for (let i = 0; i < network?.stationviewers.length; i++) {
    //   const findd =
    //     users?.data?.findIndex(data => data.id == network?.stationviewers[i]) || -1;
    //   if (findd > -1 && users?.data) {
    //     dataa.push({
    //       index: (i + 1).toString(),
    //       user: users?.data && users?.data[findd]?.username,
    //       station: (users?.data && users?.data[findd]?.station?.name) || '-',
    //       region: (users?.data && users?.data[findd]?.region?.name) || '-',
    //     });
    //   }
    // }

    const items =(viewers?.data?.users || [])
      .filter(value => value.access !== AccessEnum.admin)
      .map((value, index) => ({
        index: (index + 1).toString(),
        user: value.user.username,
        station: value.user.station?.name || '-',
        region: value.user.region?.name || '-',
      }));

    // for (let j = 0; j < dataa.length; j++) {
    //   items.push(dataa[j]);
    // }

    items.sort((a, b) => a.user.localeCompare(b.user, 'en-US'));

    const sortddata = (tabname: string, sortalfabet: boolean) => {
      if (sortalfabet) {
        items.sort(
          (a: any, b: any) =>
            -a[tabname.toLocaleLowerCase()].localeCompare(
              b[tabname.toLocaleLowerCase()],
              'en-US',
            ),
        );
      } else {
        items.sort((a: any, b: any) =>
          a[tabname.toLocaleLowerCase()].localeCompare(
            b[tabname.toLocaleLowerCase()],
            'en-US',
          ),
        );
      }

      setItemssorted(items);
    };

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
        <div className="relative flex min-h-[calc(100vh-215px)] flex-col justify-between">
          <div className="h-5/6">
            <Description label="Station Admin" className="mb-4">
              <Select
                value={userAdmin || admin?.user.id}
                disabled={
                  userrole == 'superuser' ||
                  http.stationDetail?.data?.access.role == 'superuser' ||
                  networkDetail?.data?.access?.access == 'ADMIN'
                    ? false
                    : true
                }
                onChange={e => setUserAdmin(e.target.value)}
                className="w-80">
                {userList.map(user => (
                  <option value={user.id} key={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </Description>
            <Description
              label="Station Viewer(s)"
              items="start"
              className="h-full">
              <Table
                dynamicColumns={['index']}
                renderDynamicColumn={data => data.index + 1}
                tabicon={tabname}
                onclicktitle={(tabname: string, sortalfabet: boolean) => {
                  setTabname(tabname);
                  sortddata(tabname, sortalfabet);
                }}
                cols={columns}
                items={itemssorted.length > 0 ? itemssorted : items}
                containerClassName="w-3/5 mt-[-6px]"
              />
            </Description>
          </div>
          <div className="absolue bottom-[20px] right-0 mr-4 flex flex-row gap-x-4 self-end">
            {userrole == 'superuser' ||
            http.stationDetail?.data?.access.access == 'ADMIN' ||
            networkDetail?.data?.access?.access == 'ADMIN' ? (
              <SimpleBtn link to="../edit-access">
                Edit Station Viewer(s)
              </SimpleBtn>
            ) : null}
            {userrole == 'superuser' ||
            http.stationDetail?.data?.access.access == 'ADMIN' ||
            networkDetail?.data?.access?.access == 'ADMIN' ? (
              <SimpleBtn onClick={saveAdmin}>Save</SimpleBtn>
            ) : null}
            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </div>
      </>
    );
  }, [
    viewers?.httpRequestStatus,
    users?.httpRequestStatus,
    userAdmin,
    itemssorted,
  ]);

  return <>{body}</>;
};

export default StationAccessPage;
