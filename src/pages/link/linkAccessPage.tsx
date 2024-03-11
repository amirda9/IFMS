import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import {Select, SimpleBtn, Table} from '~/components';
import {BASE_URL} from '~/constant';
import {useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {useDispatch} from 'react-redux';
import {
  setlinkviewersstatus,
  setlinkviewers,
} from './../../store/slices/networkslice';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};

const LinkAccessPage = () => {
  const {networkDetail} = useSelector((state: any) => state.http);
  const {network} = useSelector((state: any) => state);
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
    state: {viewers, users, update},
  } = useHttpRequest({
    selector: state => ({
      viewers: state.http.linkAccessList,
      users: state.http.userList,
      update: state.http.linkAccessUpdate,
    }),
    initialRequests: request => {
      request('linkAccessList', {params: {link_id: params.linkId!.split("_")[0]}});
      request('userList', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('linkAccessList', {params: {link_id:params.linkId!.split("_")[0]}});
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
      params: {link_id: params.linkId!.split("_")[0]},
      data: {user_id: userAdmin || admin!.user.id!},
    });
    request('linkAccessUpdate', {
      params: {link_id: params.linkId!.split("_")[0]!},
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
              userrole == 'superuser' ||
              linkDetail?.data?.access.role == 'superuser' ||
              networkDetail?.data?.access?.access == 'ADMIN'
                ? false
                : true
            }
            onChange={e => setUserAdmin(e.target.value)}
            className="w-[70%] text-sm">
            {userList.map(user => (
              <option onClick={() => alert('kk')} value={user.id} key={user.id}>
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
        {userrole == 'superuser' ||
        linkDetail?.data?.access.access == 'ADMIN' ||
        networkDetail?.data?.access?.access == 'ADMIN' ? (
          <SimpleBtn link to="../edit-access">
            Edit Link Viewer(s)
          </SimpleBtn>
        ) : null}
        {userrole == 'superuser' ||
        linkDetail?.data?.access.access == 'ADMIN' ||
        networkDetail?.data?.access?.access == 'ADMIN' ? (
          <SimpleBtn onClick={saveAdmin}>Save</SimpleBtn>
        ) : null}

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
