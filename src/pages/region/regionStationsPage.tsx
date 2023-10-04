import React, {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {BASE_URL} from '~/constant';
import {useSelector} from 'react-redux';
import {BsChevronDown} from 'react-icons/bs';

const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};

const RegionStationsPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {newregionstationlist} = useSelector((state: any) => state.network);
  const login = localStorage.getItem('login');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
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
    }),
    initialRequests: request => {
      request('regionStationList', {params: {region_id: params.regionId!}});
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.update?.httpRequestStatus === 'loading' &&
        state.update!.httpRequestStatus === 'success'
      ) {
        request('regionStationList', {params: {region_id: params.regionId!}});
      }
    },
  });

  const dataa =
    state.list?.data?.map(station => ({
      name: station.name,
      latitude: station.longitude,
      longitude: station.latitude,
    })) || [];

  useEffect(() => {
    setItemssorted(dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US')));
  }, []);

  const sortddata = (tabname: string, sortalfabet: boolean) => {
    if (sortalfabet) {
      if (tabname == 'Name') {
        dataa.sort(
          (a: any, b: any) =>
            -a[tabname.toLocaleLowerCase()].localeCompare(
              b[tabname.toLocaleLowerCase()],
              'en-US',
            ),
        );
      } else {
        dataa.sort(
          (a: any, b: any) =>
            a[tabname.toLocaleLowerCase()] - b[tabname.toLocaleLowerCase()],
        );
      }
    } else {
      if (tabname == 'Name') {
        dataa.sort((a: any, b: any) =>
          a[tabname.toLocaleLowerCase()].localeCompare(
            b[tabname.toLocaleLowerCase()],
            'en-US',
          ),
        );
      } else {
        dataa.sort(
          (a: any, b: any) =>
            b[tabname.toLocaleLowerCase()] - a[tabname.toLocaleLowerCase()],
        );
      }
    }

    setItemssorted(dataa);
  };

  const save = () => {
    let first = state?.list?.data || [];
    if (first.length == 0 && newregionstationlist?.length == 0) {
    } else {
      request('updateregionStationList', {
        params: {region_id: params.regionId!},
        data: {stations_id: newregionstationlist},
      });
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          cols={columns}
          tabicon={'Name'}
          items={itemssorted}
          onclicktitle={(tabname: string, sortalfabet: boolean) =>
            sortddata(tabname, sortalfabet)
          }
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
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RegionStationsPage;
