import {useMemo, useState} from 'react';
import {Select, SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {AccessEnum} from '~/types';
import {useDispatch} from 'react-redux';
import {FormLayout} from '~/layout';
import {useSelector} from 'react-redux';
import {useNavigate, useParams} from 'react-router-dom';
import {
  setregionviewersstatus,
  setregionviewers,
} from './../../store/slices/networkslice';
import {UserRole} from '~/constant/users';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  user: {label: 'User', size: 'w-[30%]', sort: true},
  region: {label: 'Region', size: 'w-[30%]'},
  station: {label: 'Station', size: 'w-[30%]'},
};
type regionId={
  regionId:string,networkId:string
  }
const RegionAccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [itemssorted, setItemssorted] = useState<
    {
      index: string;
      user: string;
      station: string;
      region: string;
    }[]
  >([]);
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {network} = useSelector((state: any) => state);
  const [tabname, setTabname] = useState('User');
  const login = localStorage.getItem('login');
  const {networkidadmin} = useSelector((state: any) => state.networktree);
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const params = useParams<regionId>();
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
      request('regionAccessList', {
        params: {region_id: params!.regionId!},
      });
      request('userList', undefined);
    },
    onUpdate: lastState => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        update?.httpRequestStatus === 'success'
      ) {
        request('regionAccessList', {
          params: {region_id: params!.regionId!},
        });
        navigate('../access', {replace: true, relative: 'path'});
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
    request('regionAdminUpdate', {
      params: {region_id: params!.regionId!},
      data: {user_id: userAdmin || admin!.user.id!},
    });
    request('regionAccessUpdate', {
      params: {region_id: params!.regionId!},
      data: {users: network?.regionviewers},
    });
    dispatch(setregionviewersstatus(false)), dispatch(setregionviewers([]));
  };
  var dataa: any = [];

  const body = useMemo(() => {
    for (let i = 0; i < network?.regionviewers.length; i++) {
      const findd = users!.data!.findIndex(
        data => data.id == network?.regionviewers[i],
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
    const items = network.regionviewersstatus
      ? dataa
      : (viewers?.data?.users || [])
          .filter(value => value.access !== AccessEnum.admin)
          .map((value, index) => ({
            index: (index + 1).toString(),
            user: value.user.username,
            station: value.user.station?.name || '-',
            region: value.user.region?.name || '-',
          }))
          .sort((a, b) => a.user.localeCompare(b.user, 'en-US'));

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
        <div className="mb-10 flex flex-col">
          <span className="mb-[15px] text-[20px] font-normal leading-[24.2px]">
            Region Admin
          </span>
          <Select
            disabled={loggedInUser.role !== UserRole.SUPER_USER && !networkidadmin.includes(params!.networkId!)}
            className="w-[70%]"
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
        </div>

        <div className="mb-6 flex flex-col">
          <span className="mb-[15px] text-[20px] font-normal leading-[24.2px]">
            Region Viewer(s)
          </span>
          <Table
            dynamicColumns={['index']}
            renderDynamicColumn={data => data.index + 1}
            tabicon={tabname}
            onclicktitle={(tabname: string, sortalfabet: boolean) => {
              setTabname(tabname);
              sortddata(tabname, sortalfabet);
            }}
            items={itemssorted.length > 0 ? itemssorted : items}
            loading={viewers?.httpRequestStatus === 'loading'}
            cols={columns}
            containerClassName="w-full mt-[-6px]"
          />
        </div>

        {/* <Description label="Region Viewer(s)" items="start" className="h-full">
          <Table
               dynamicColumns={['index']}
               renderDynamicColumn={data => data.index + 1}
               tabicon={tabname}
         
               onclicktitle={(tabname: string, sortalfabet: boolean) => {
                setTabname(tabname);
                sortddata(tabname, sortalfabet);
              }}
            items={
              itemssorted.length > 0
                ? itemssorted
                : items
            }
            loading={viewers?.httpRequestStatus === 'loading'}
            cols={columns}
            containerClassName="w-3/5 mt-[-6px]"
          />
        </Description> */}
      </>
    );
  }, [
    viewers?.httpRequestStatus,
    users?.httpRequestStatus,
    userAdmin,
    itemssorted,
    network?.regionviewers,
  ]);
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

      <SimpleBtn
        onClick={() => {
          dispatch(setregionviewersstatus(false)),
            dispatch(setregionviewers([]));
        }}>
        Cancel
      </SimpleBtn>
    </>
  );
  return <FormLayout buttons={buttons}>{body}</FormLayout>;
};

export default RegionAccessPage;
