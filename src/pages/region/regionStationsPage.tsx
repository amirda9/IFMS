import React, {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {BASE_URL} from '~/constant';
import {useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {BsChevronDown} from 'react-icons/bs';
import {
  setnewregionstationlist,
  setnewregionstationliststatus,
} from './../../store/slices/networkslice';
import {useDispatch} from 'react-redux';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};

const RegionStationsPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {newregionstationlist, regionviewers, newregionstationliststatus} =
    useSelector((state: any) => state.network);
  const {network} = useSelector((state: any) => state);
  const networkId = Cookies.get(networkExplored) || '';
  const dispatch = useDispatch();
  const login = localStorage.getItem('login');
  const [tabname, setTabname] = useState('Name');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [appendstationsdata, setAppendstationsdata] = useState([]);
  const [removestationsdata, setRemovetationsdata] = useState([]);
  const [userrole, setuserrole] = useState<any>('');
  const [itemssorted, setItemssorted] = useState<
    {
      name: string;
      latitude: number;
      longitude: number;
    }[]
  >([]);
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
  const params = useParams<{regionId: string}>();
  const {state, request} = useHttpRequest({
    selector: state => ({
      list: state.http.regionStationList,
      update: state.http.updateregionStationList,
      remove: state.http.removeregionStationList,
      add: state.http.addregionStationList,
      stations: state.http.allStations,
    }),
    initialRequests: request => {
      request('regionStationList', {params: {region_id: params.regionId!}});
      if (networkId) {
        request('allStations', undefined);
      }
    },
    onUpdate: (lastState, state) => {
      if (
        (lastState.remove?.httpRequestStatus === 'loading' &&
          state.remove!.httpRequestStatus === 'success') ||
        (lastState.add?.httpRequestStatus === 'loading' &&
          state.add!.httpRequestStatus === 'success')
      ) {
        request('regionStationList', {params: {region_id: params.regionId!}});
      }
    },
  });
  console.log(state.list, '👾');

  const dataa =
    state.list?.data?.map(station => ({
      name: station.name,
      latitude: station.longitude,
      longitude: station.latitude,
    })) || [];

  var dataa2: any = [];
  useEffect(() => {
    if (newregionstationliststatus) {
      setItemssorted(network?.newregionstationlist);
    } else {
      setItemssorted(
        dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US')),
      );
    }
  }, [state]);

  const sortddata = (tabnamee: string, sortalfabet: boolean) => {
    console.log(tabnamee, sortalfabet, 'rrrr');
    const newdataa = newregionstationliststatus
      ? [...newregionstationlist]
      : [...dataa];
    if (sortalfabet) {
      if (tabnamee == 'Name') {
        newdataa.sort(
          (a: any, b: any) =>
            -a[tabnamee.toLocaleLowerCase()].localeCompare(
              b[tabnamee.toLocaleLowerCase()],
              'en-US',
            ),
        );
      } else {
        newdataa.sort(
          (a: any, b: any) =>
            a[tabnamee.toLocaleLowerCase()] - b[tabnamee.toLocaleLowerCase()],
        );
      }
    } else {
      if (tabnamee == 'Name') {
        newdataa.sort((a: any, b: any) =>
          a[tabnamee.toLocaleLowerCase()].localeCompare(
            b[tabnamee.toLocaleLowerCase()],
            'en-US',
          ),
        );
      } else {
        newdataa.sort(
          (a: any, b: any) =>
            b[tabnamee.toLocaleLowerCase()] - a[tabnamee.toLocaleLowerCase()],
        );
      }
    }

    setItemssorted(newdataa);
  };

  const save = () => {
    const appenddata = [];
    const removedata = [];
    const alllist = state?.list?.data || [];
    const newregionstationlist2 = newregionstationlist.map(
      (data: any) => data.id,
    );
    for (let i = 0; i < alllist.length; i++) {
      const find = newregionstationlist2.findIndex((data: any) => data == alllist[i].id);
      if (find < 0) {
        removedata.push(alllist[i].id);
      }
    }

    for (let j = 0; j < newregionstationlist2.length; j++) {
      const find = alllist.findIndex(
        (data: any) => data.id == newregionstationlist2[j],
      );
      if (find < 0) {
        appenddata.push(newregionstationlist2[j]);
      }
    }

    let first = state?.list?.data || [];
    if (first.length == 0 && newregionstationlist2?.length == 0) {
    } else {
      request('removeregionStationList', {
        params: {region_id: params.regionId!},
        data: {stations_id: removedata},
      });
      request('addregionStationList', {
        params: {region_id: params.regionId!},
        data: {stations_id: appenddata},
      });
    }
    dispatch(setnewregionstationliststatus(false)),
    dispatch(setnewregionstationlist([]));

  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          cols={columns}
          items={itemssorted}
          tabicon={tabname}
          onclicktitle={(tabname: string, sortalfabet: boolean) => {
            setTabname(tabname);
            sortddata(tabname, sortalfabet);
          }}
          dynamicColumns={['index']}
          renderDynamicColumn={data => data.index + 1}
          containerClassName="w-3/5"
        />
      </div>
      <div className="mr-4 flex flex-row gap-x-4 self-end">
        {userrole == 'superuser' ||
        networkDetail?.data?.access?.access == 'ADMIN' ||
        regionDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn link to="../edit-stationlist">
            Edit Stations List
          </SimpleBtn>
        ) : null}
        {userrole == 'superuser' ||
        networkDetail?.data?.access?.access == 'ADMIN' ||
        regionDetail?.data?.access.access == 'ADMIN' ? (
          <SimpleBtn onClick={save}>Save</SimpleBtn>
        ) : null}
        <SimpleBtn
          onClick={() => {
            dispatch(setnewregionstationliststatus(false)),
              dispatch(setnewregionstationlist([]));
          }}>
          Cancel
        </SimpleBtn>
      </div>
    </div>
  );
};

export default RegionStationsPage;
