import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Select, SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {useDispatch} from 'react-redux';
import {
  setlinkviewersstatus,
  setlinkviewers,
} from './../../store/slices/networkslice';
import {UserRole} from '~/constant/users';
import {toast} from 'react-toastify';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
type Iprops = {
  regionId: string;
  networkId: string;
  linkId: string;
};
const LinkAccessPage = () => {
  const params = useParams<Iprops>();
  const {network} = useSelector((state: any) => state);
  const [tabname, setTabname] = useState('User');
  const dispatch = useDispatch();
  const {networkidadmin, regionidadmin} = useSelector(
    (state: any) => state.networktree,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const [itemssorted, setItemssorted] = useState<
    {
      index: string;
      user: string;
      station: string;
      region: string;
    }[]
  >([]);

  const [userAdmin, setUserAdmin] = useState<string | undefined>();

  const {
    request,
    state: {viewers, users},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.linkAccessList,
      users: state.http.userList,
      update: state.http.linkAccessUpdate,
      linkAddadmin: state.http.linkAddadmin,
    }),
    initialRequests: request => {
      request('linkAccessList', {params: {link_id: params.linkId!}});
      request('userList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        toast('Updating the link viewer was successful', {
          type: 'success',
          autoClose: 1000,
        });
        request('linkAccessList', {params: {link_id: params.linkId!}});
      }

      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'error'
      ) {
        toast('Updating the link viewer encountered an error', {
          type: 'error',
          autoClose: 1000,
        });
      }

      if (
        lastState.linkAddadmin?.httpRequestStatus === 'loading' &&
        state.linkAddadmin!.httpRequestStatus === 'success'
      ) {
        toast('Updating the link Admin was successful', {
          type: 'success',
          autoClose: 1000,
        });
      }

      if (
        lastState.linkAddadmin?.httpRequestStatus === 'loading' &&
        state.linkAddadmin!.httpRequestStatus === 'error'
      ) {
        toast('Updating the link admin encountered an error', {
          type: 'error',
          autoClose: 1000,
        });
      }
    },
  });

  var dataa: any = [];
  for (let i = 0; i < network?.linkviewers.length; i++) {
    const findd = users!.data!.findIndex(
      data => data.id == network?.linkviewers[i],
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

  const items = network.linkviewersstatus
    ? dataa.sort((a: any, b: any) => a.user.localeCompare(b.user, 'en-US'))
    : (viewers?.data?.users || [])
        .filter(value => value.access !== AccessEnum.admin)
        .map((value, index) => ({
          index: (index + 1).toString(),
          user: value.user.username,
          station: value.user.station?.name || '-',
          region: value.user.region?.name || '-',
        }))
        .sort((a, b) => a.user.localeCompare(b.user, 'en-US'));

  const admin = viewers?.data?.users.find(
    viewer => viewer.access === AccessEnum.admin,
  );
  const ifUserExist = users?.data?.some(user => user.id === admin?.user.id);

  const userList =
    users?.httpRequestStatus === 'success' ? [...users.data!] : [];
  if (!ifUserExist && admin) {
    userList.push({...admin.user});
  }

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
    request('linkAccessUpdate', {
      params: {link_id: params.linkId!},
      data: {users: network?.linkviewers},
    });
    dispatch(setlinkviewersstatus(false)), dispatch(setlinkviewers([]));
  };

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

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="h-5/6">
        <div className="mb-6 flex flex-col">
          <span className="mb-[15px] text-[20px] font-normal leading-[24.2px]">
            Link Admin
          </span>
          <Select
            value={userAdmin || admin?.user.id}
            disabled={
              loggedInUser.role !== UserRole.SUPER_USER &&
              !networkidadmin.includes(params.networkId!) &&
              !regionidadmin.includes(params.regionId!)
            }
            onChange={e => setUserAdmin(e.target.value)}
            className="w-[70%] text-sm">
            {userList.sort((a: any, b: any) =>
                    a.username.localeCompare(b.username),
                  ).map(user => (
              <option  value={user.id} key={user.id}>
                {user?.station?.name || ''} {user.username}
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
            onclicktitle={(tabname: string, sortalfabet: boolean) => {
              sortddata(tabname, sortalfabet);
              setTabname(tabname);
            }}
            tabicon={tabname}
            cols={columns}
            items={itemssorted.length > 0 ? itemssorted : items}
            containerClassName="w-full mt-[-5px]"
          />
        </div>
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        <SimpleBtn link to="../edit-access">
          Edit Link Viewer(s)
        </SimpleBtn>

        <SimpleBtn onClick={saveAdmin}>Save</SimpleBtn>

        <SimpleBtn
          onClick={() => {
            dispatch(setlinkviewersstatus(false)), dispatch(setlinkviewers([]));
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default LinkAccessPage;
