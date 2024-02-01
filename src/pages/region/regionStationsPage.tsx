import React, {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {BASE_URL} from '~/constant';
import {useSelector} from 'react-redux';
import {
  setnewregionstationlist,
  setnewregionstationliststatus,
} from './../../store/slices/networkslice';
import {useDispatch} from 'react-redux';
import {deepcopy} from '~/util';
import {$Post} from '~/util/requestapi';
import {
  allregionstationstype,
  setRegionstations,
  setdefaultRegionstations,
} from '~/store/slices/networktreeslice';
import {RootState} from '~/store';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};

const RegionStationsPage = () => {
  const {regionDetail, networkDetail} = useSelector((state: any) => state.http);
  const {newregionstationlist, regionviewers, newregionstationliststatus} =
    useSelector((state: RootState) => state.network);
  const {network} = useSelector((state: any) => state);
  const {regionstations, defaultregionstations} = useSelector(
    (state: RootState) => state.networktree,
  );
  const dispatch = useDispatch();
  const login = localStorage.getItem('login');
  const [tabname, setTabname] = useState('Name');
  const accesstoken = JSON.parse(login || '')?.data.access_token;
  const [userrole, setuserrole] = useState<string>('');
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
      request('regionStationList', {
        params: {region_id: params.regionId!.split('_')[0]},
      });

      request('allStations', undefined);
    },
    onUpdate: (lastState, state) => {
      if (
        (lastState.remove?.httpRequestStatus === 'loading' &&
          state.remove!.httpRequestStatus === 'success') ||
        (lastState.add?.httpRequestStatus === 'loading' &&
          state.add!.httpRequestStatus === 'success')
      ) {
        request('regionStationList', {
          params: {region_id: params.regionId!.split('_')[0]},
        });
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
    if (newregionstationliststatus) {
      setItemssorted(network?.newregionstationlist);
    } else {
      setItemssorted(
        dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US')),
      );
    }
  }, [state]);

  const sortddata = (tabnamee: string, sortalfabet: boolean) => {
    const newdataa: any = newregionstationliststatus
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

  const save = async () => {
    const appenddata: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[] = [];
    const removedata: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[] = [];
    const alllist = state?.list?.data || [];
    const newregionstationlist2: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    }[] = deepcopy(newregionstationlist);

    for (let i = 0; i < alllist.length; i++) {
      const find = newregionstationlist2.findIndex(
        data => data.id == alllist[i].id,
      );
      if (find < 0) {
        removedata.push(alllist[i]);
      }
    }

    for (let j = 0; j < newregionstationlist2.length; j++) {
      const find = alllist.findIndex(
        data => data.id == newregionstationlist2[j].id,
      );
      if (find < 0) {
        appenddata.push(newregionstationlist2[j]);
      }
    }

    const regionstationsCopy: allregionstationstype[] =
      deepcopy(regionstations);
    const findregionindex = regionstations.findIndex(
      data => data.regionid == params.regionId!.split('_')[0],
    );

    let first = state?.list?.data || [];
    if (first.length == 0 && newregionstationlist2?.length == 0) {
    } else {
      const append = await $Post(
        `otdr/region/${
          params.regionId!.split('_')[0]
        }/update_stations?action_type=append`,
        {stations_id: appenddata.map(data => data.id)},
      );
      // we should update regionstations in networktree
      if (append.status == 201) {
        //add stations to some regionstations in networktree
        regionstationsCopy[findregionindex].stations = [
          ...regionstations[findregionindex].stations,
          ...appenddata.map(data => ({id: data.id, name: data.name})),
        ];
        //We remove the stations from some regionstations because we have connected some of the stations to another region.

        for (let k = 0; k < regionstationsCopy.length; k++) {
          if (
            // regionstationsCopy[k].networkid == params.regionId!.split('_')[1] &&
            regionstationsCopy[k].regionid != params.regionId!.split('_')[0]
          ) {
            for (let x = 0; x < appenddata.length; x++) {
              let newlist = regionstationsCopy[k].stations.filter(
                data => data.id != appenddata[x].id,
              );
              regionstationsCopy[k].stations = newlist;
            }
          }
        }
      }

      const remove = await $Post(
        `otdr/region/${
          params.regionId!.split('_')[0]
        }/update_stations?action_type=remove`,
        {stations_id: removedata.map(data => data.id)},
      );

      //remove stations from some regionstations in networktree
      if (remove.status == 201) {
        const defaultregionStationsCopy = deepcopy(defaultregionstations);
        const findefaultregionindex = defaultregionstations.findIndex(
          data => data.networkid == params.regionId!.split('_')[1],
        );
        for (let s = 0; s < removedata.length; s++) {
          const findindexdata = regionstationsCopy[
            findregionindex
          ].stations.findIndex(data => data.id == removedata[s].id);
          if (findindexdata > -1) {
            regionstationsCopy[findregionindex].stations.splice(
              findindexdata,
              1,
            );
          }

          if (findefaultregionindex > -1) {
            defaultregionStationsCopy[findefaultregionindex].stations.push({
              id: removedata[s].id,
              name: removedata[s].name,
            });
          }
        }
        dispatch(
          setdefaultRegionstations({
            networkid: params.regionId!.split('_')[1],
            stations: defaultregionStationsCopy[findefaultregionindex].stations,
          }),
        );
      }
    }

    dispatch(setRegionstations(regionstationsCopy));
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
          containerClassName="w-full"
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
