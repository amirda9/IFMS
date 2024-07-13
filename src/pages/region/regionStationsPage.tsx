import {useEffect, useState} from 'react';
import {SimpleBtn, Table} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
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
import {UserRole} from '~/constant/users';
const columns = {
  index: {label: 'Index', size: 'w-[10%]'},
  name: {label: 'Name', size: 'w-[45%]', sort: true},
  latitude: {label: 'Latitude', size: 'w-[22.5%]'},
  longitude: {label: 'Longitude', size: 'w-[22.5%]'},
};
type Iprops={
  regionId:string,networkId:string
  }
const RegionStationsPage = () => {
  const [loading, setLoading] = useState(false);
  const {newregionstationlist, newregionstationliststatus} = useSelector(
    (state: RootState) => state.network,
  );
  const {network} = useSelector((state: any) => state);
  const {
    regionstations,
    defaultregionstations,
    networkidadmin,
  } = useSelector((state: RootState) => state.networktree);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const dispatch = useDispatch();
  const [tabname, setTabname] = useState('Name');

  const [itemssorted, setItemssorted] = useState<
    {
      name: string;
      latitude: number;
      longitude: number;
    }[]
  >([]);

  const params = useParams<Iprops>();
  const {state, request} = useHttpRequest({
    selector: state => ({
      list: state.http.regionStationList,
      update: state.http.updateregionStationList,
      remove: state.http.removeregionStationList,
      add: state.http.addregionStationList,
      stations: state.http.allStations,
      networklinks: state.http.networklinks,
    }),
    initialRequests: request => {
      request('regionStationList', {
        params: {region_id: params.regionId!},
      });
      request('networklinks', {
        params: {network_id: params.networkId!},
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
          params: {region_id: params.regionId!},
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
    setLoading(true);
    const defaultregionStationsCopy = deepcopy(defaultregionstations);
    const findefaultregionindex = defaultregionstations.findIndex(
      data => data.networkid == params.networkId!,
    );

    try {
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

      let regionstationsCopy: allregionstationstype[] =
        deepcopy(regionstations);
      const findregionindex = regionstations.findIndex(
        data => data.regionid == params.regionId!,
      );

      let first = state?.list?.data || [];
      if (first.length == 0 && newregionstationlist2?.length == 0) {
      } else {
        const [append, remove] = await Promise.all([
          $Post(
            `otdr/region/${
              params.regionId!
            }/update_stations?action_type=append`,
            {stations_id: appenddata.map(data => data.id)},
          ),
          $Post(
            `otdr/region/${
              params.regionId!
            }/update_stations?action_type=remove`,
            {stations_id: removedata.map(data => data.id)},
          ),
        ]);

        // // we should update regionstations in networktree
        if (append?.status == 201 && remove?.status == 201) {
          // add stations to some regionstations in networktree
          regionstationsCopy[findregionindex].stations = [
            ...regionstations[findregionindex].stations,
            ...appenddata.map(data => ({id: data.id, name: data.name})),
          ];

          //   //We remove the stations from some regionstations because we have connected some of the stations to another region.

          for (let k = 0; k < regionstationsCopy.length; k++) {
            if (
              regionstationsCopy[k].networkid ==
                params.networkId!  &&
              regionstationsCopy[k].regionid != params.regionId!
            ) {
              for (let x = 0; x < appenddata.length; x++) {
                let newlist = regionstationsCopy[k].stations.filter(
                  data => data.id != appenddata[x].id,
                );
                regionstationsCopy[k].stations = newlist;
              }
            }
          }

          // remove some stations from defaultregion
          for (let w = 0; w < appenddata.length; w++) {
            const findindefault = defaultregionStationsCopy[
              findefaultregionindex
            ]?.stations?.findIndex(
              (stationdata: any) => stationdata.id == appenddata[w].id,
            );
            if (findindefault > -1) {
              defaultregionStationsCopy[
                findefaultregionindex
              ]?.stations?.splice(findindefault, 1);
            }
          }
        }

        // //remove stations from some regionstations in networktree
        if (remove?.status == 201 && append?.status == 201) {
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
            } else {
              defaultregionStationsCopy.push({
                networkid: params.networkId!,
                stations: [
                  {
                    id: removedata[s].id,
                    name: removedata[s].name,
                  },
                ],
              });
            }
          }
        }
      }
      dispatch(setRegionstations(regionstationsCopy));
      dispatch(setnewregionstationliststatus(false)),
        dispatch(setnewregionstationlist([]));
      dispatch(
        setdefaultRegionstations({
          networkid: params.networkId!,
          stations: defaultregionStationsCopy[findefaultregionindex]?.stations,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="relative h-5/6">
        <Table
          loading={state.stations?.httpRequestStatus === 'loading' || loading}
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
        {loggedInUser.role === UserRole.SUPER_USER ||
        networkidadmin.includes(params.networkId!) ? (
          <SimpleBtn link to="../edit-stationlist">
            Edit Stations List
          </SimpleBtn>
        ) : null}
        {loggedInUser.role === UserRole.SUPER_USER ||
        networkidadmin.includes(params.networkId!) ? (
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
