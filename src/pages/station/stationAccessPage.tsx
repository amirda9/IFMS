import {useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Select, SimpleBtn, Table} from '~/components';
import {UserRole} from '~/constant/users';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {
  setstationviewers,
  setstationviewersstatus,
} from '~/store/slices/networkslice';
import {AccessEnum} from '~/types';
import {$Post, $Put} from '~/util/requestapi';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
type Iprops = {
  regionId: string;
  networkId: string;
  stationId: string;
};
const StationAccessPage = () => {
  const {regionidadmin, networkidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const [loading, setLoading] = useState(false);
  const [updateloading, setUpdateloading] = useState(false);
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
  const {network} = useSelector((state: any) => state);

  const {
    request,
    state: {viewers, users},
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
  });

  const changeAdmin = async () => {
    try {
      setUpdateloading(true)
      const admin = viewers?.data?.users.find(
        viewer => viewer.access === AccessEnum.admin,
      );
      const updateadminresponse = await $Put(
        `otdr/station/${params.stationId!}/access/admin`,
        {user_id: userAdmin || admin!.user.id!},
      );
      if (updateadminresponse?.status == 201) {
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`update admin error is :${error}`);
    } finally {
      setUpdateloading(false)
    }
  };

  const saveAdmin = async () => {
    try {
      setUpdateloading(true)
      setLoading(true)
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
      const [updateacsecc, updateadmin] = await Promise.all([
        $Post(`otdr/station/${params?.stationId!}/access/viewers`, {
          users: network?.stationviewers,
        }),
        $Put(`otdr/station/${params.stationId!}/access/admin`, {
          user_id: userAdmin || admin!.user.id!,
        }),
      ]);
      if (updateacsecc?.status == 201 && updateadmin?.status == 201) {
        request('stationAccessList', {
          params: {station_id: params.stationId!},
        });
        toast('It was done successfully', {
          type: 'success',
          autoClose: 1000,
        });
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`error is:${error}`);
    } finally {
      setLoading(false);
      setUpdateloading(false);
    }

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
                {userList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map(user => (
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
                loading={loading}
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
            type="button"
              loading={updateloading}
              onClick={network.stationviewersstatus ? saveAdmin : changeAdmin}>
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
