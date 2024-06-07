import React, {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Select, SimpleBtn, Table} from '~/components';
import {UserRole} from '~/constant/users';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {
  setstationviewers,
  setstationviewersstatus,
} from '~/store/slices/networkslice';
import {AccessEnum} from '~/types';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
type Iprops={
  regionId:string,networkId:string,stationId:string
  }
const StationAccessPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {regionidadmin, networkidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const login = localStorage.getItem('login');
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

  const params = useParams<Iprops>();
  const [userAdmin, setUserAdmin] = useState<string | undefined>();
  const {http, network} = useSelector((state: any) => state);

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
      request('stationAccessList', {
        params: {station_id: params.stationId!},
      });
      request('userList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('stationAccessList', {
          params: {station_id: params.stationId!},
        });
      }
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
    request('stationAddadmin', {
      params: {station_id: params.stationId!},
      data: {user_id: userAdmin || admin!.user.id!},
    });
    request('stationAccessUpdate', {
      params: {station_id: params.stationId!},
      data: {users: network?.stationviewers},
    });
    dispatch(setstationviewers([]));
    dispatch(setstationviewersstatus(false));
  };

  var dataa: any = [];
  for (let i = 0; i < network?.stationviewers.length; i++) {
    const findd = users!.data!.findIndex(
      data => data.id == network?.stationviewers[i],
    );
    if (findd > -1) {
      dataa.push({
        index: (i + 1).toString(),
        user: users?.data && users?.data[findd]?.username,
        station: (users?.data && users?.data[findd]?.station?.name) || '-',
        region: (users?.data && users?.data[findd]?.region?.name) || '-',
      });
    }
  }

  const body = useMemo(() => {
    const items = network.stationviewersstatus
      ? dataa.sort((a: any, b: any) => a.user.localeCompare(b.user, 'en-US'))
      : (viewers?.data?.users || [])
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

    items.sort((a: any, b: any) => a.user.localeCompare(b.user, 'en-US'));

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
        <div className="relative flex min-h-[calc(100vh-220px)] flex-col justify-between">
          <div className="h-5/6">
            <div className="mb-6 flex flex-col">
              <span className="mb-[15px] text-[20px] font-normal leading-[24.2px]">
                Station Admin
              </span>
              <Select
                value={userAdmin || admin?.user.id}
                disabled={
                  loggedInUser.role !== UserRole.SUPER_USER &&
                  !networkidadmin.includes(params.networkId!) &&
                  !regionidadmin.includes(params.regionId!)
                }
                onChange={e => setUserAdmin(e.target.value)}
                className="w-[70%]">
                {userList.map(user => (
                  <option value={user.id} key={user.id}>
                    {user.username}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mb-6 flex flex-col">
              <span className="mb-[15px] text-[20px] font-normal leading-[24.2px]">
                Link Viewer(s)
              </span>
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
                containerClassName="w-full mt-[-6px]"
              />
            </div>
          </div>
          <div className="absolue bottom-[20px] right-0 mr-4 flex flex-row gap-x-4 self-end">
            <SimpleBtn link to="../edit-access">
              Edit Station Viewer(s)
            </SimpleBtn>

            <SimpleBtn
              onClick={network.stationviewersstatus ? saveAdmin : () => {}}>
              Save
            </SimpleBtn>

            <SimpleBtn
              onClick={() => {
                dispatch(setstationviewers([])),
                  dispatch(setstationviewersstatus(false));
              }}>
              Cancel
            </SimpleBtn>
          </div>
        </div>
      </>
    );
  }, [
    viewers?.httpRequestStatus,
    users?.httpRequestStatus,
    userAdmin,
    itemssorted,
    network?.stationviewers,
  ]);

  return <>{body}</>;
};

export default StationAccessPage;
