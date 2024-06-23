import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {object, string} from 'yup';
import {deepcopy} from '~/util';
import networkslice from './networkslice';
import {$Get, $Put} from '~/util/requestapi';
export enum statustype {
  TRUE = 'true',
  FALSE = 'false',
  NONE = 'none',
}

export type allLeftbartype = {
  networkId: string;
  name: string;
  check: statustype;
  open: boolean;
  Length: number;
  Max: number;
  MainRtues: string[];
  Rtues: string[];
  Regions: {
    name: string;
    id: string;
    open: boolean;
    check: statustype;
    Length: number;
    Max: number;
    MainRtues: string[];
    Rtues: string[];
    Stations: {
      stationId: string;
      check: statustype;
      open: boolean;
      Length: number;
      Max: number;
      MainRtues: string[];
      Rtues: string[];
    }[];
  }[];
};
export type stationtype = {stationid: string; check: boolean};

export type regiontype = {
  check: boolean;
  regionid: string;
  Length: number;
  station: stationtype[];
};
export type rtuleftbar = {
  Length: number;
  networkid: string;
  check: boolean;
  region: regiontype[];
};

export type leftbarcheckboxlisttype = {
  payload: rtuleftbar[];
  type: string;
};
export type networkregionstype = {
  payload: {
    networkid: string;
    regions: {name: string; id: string}[];
  }[];
  type: string;
};

export type regionstationstype = {
  payload: {
    networkid: string;
    regionid: string;
    stations: {name: string; id: string}[];
  }[];
  type: string;
};
export type defaultregionstationstype = {
  payload: {networkid: string; stations: {name: string; id: string}[]};
  type: string;
};
export type regionlinkstype = {
  payload: {
    networkid: string;
    regionid: string;
    links: {
      name: string;
      id: string;
      source_id: string;
      destination_id: string;
    }[];
    // ,source:string,destination:string,sourceregionid:string,destinationregionid:string
  }[];
  type: string;
};
export type defaultregionlinkstype = {
  payload: {
    networkid: string;
    links: {
      name: string;
      id: string;
      source_id: string;
      destination_id: string;
    }[];
  };
  type: string;
};
export type allstationsrtutype = {
  stationid: string;
  regionid: string;
  networkid: string;
  rtues: {name: string; id: string}[];
  deletertues: string[];
};

export type stationsrtutype = {
  payload: allstationsrtutype[];
  type: string;
};

export type allnetworkregionstype = {
  networkid: string;
  regions: {name: string; id: string}[];
};

type deletegroupstationtype = {
  payload: {networkid: string; regionid: string; stationsid: string[]};
  type: string;
};

type deletedefaultgroupstationtype = {
  payload: {networkid: string; stationsid: string[]};
  type: string;
};

type deletegrouplinktype = {
  payload: {regionid: string; linksid: string[]};
  type: string;
};

type deletedefaultgrouplinktype = {
  payload: {networkid: string; linksid: string[]};
  type: string;
};

type selectedstationtype = {
  networkid: string;
  regionid: string;
  stationsID: string[];
};

type selecteddefaultstationtype = {
  networkid: string;
  stationsID: string[];
};

type selectedlinktype = {
  networkid: string;
  regionid: string;
  linkID: string[];
};

type selecteddefaultlinktype = {
  networkid: string;
  linkID: string[];
};

type createregiontype = {
  payload: {networkid: string; regionid: string; regionname: string};
  type: string;
};

type changeRegion = {
  payload: {
    networkid: string;
    regionid: string;
    regionname: string;
    newnetworkid: string;
  };
  type: string;
};

export type allregionstationstype = {
  networkid: string;
  regionid: string;
  stations: {name: string; id: string}[];
};
export type alldefaultregionstationstype = {
  networkid: string;
  stations: {name: string; id: string}[];
};
export type allregionlinkstype = {
  networkid: string;
  regionid: string;
  links: {
    name: string;
    id: string;
    source_id: string;
    destination_id: string;
  }[];
  // ,source:string,destination:string,sourceregionid:string,destinationregionid:string
};

export type alldefaultregionlinkstype = {
  networkid: string;
  links: {
    name: string;
    id: string;
    source_id: string;
    destination_id: string;
  }[];
};

type leftbarStationcheckboxlist = {
  length: number;
  stationid: string;
  rtues: string[];
}[];
type createStationtype = {
  payload: {
    networkid: string;
    regionid: string;
    stationid: string;
    stationname: string;
  };
  type: string;
};

type updateStationnametype = {
  payload: {
    newregionid: string;
    networkid: string;
    regionid: string;
    stationid: string;
    stationname: string;
  };
  type: string;
};

type updatedefaultStationtype = {
  payload: {
    networkid: string;
    regionid: string | null;
    stationid: string;
    stationname: string;
  };
  type: string;
};

type updateStationtype = {
  payload: {
    newregionid: string;
    networkid: string;
    regionid: string;
    stationid: string;
    stationname: string;
    rtu_placement: boolean;
    longitude: number;
    latitude: number;
    description: string;
  };
  type: string;
};

type createLinktype = {
  payload: {
    networkid: string;
    regionid: string;
    linkid: string;
    linkname: string;
    source_id: string;
    destination_id: string;
  };
  type: string;
};

type networklisttype = {
  payload: {id: string; name: string}[];
  type: string;
};

type createnetworkType = {
  payload: {id: string; name: string};
  type: string;
};
export type initialStatetype = {
  networkslist: {id: string; name: string}[];
  leftbarStationcheckboxlist: leftbarStationcheckboxlist;
  networkregions: allnetworkregionstype[];
  regionstations: allregionstationstype[];
  defaultregionstations: alldefaultregionstationstype[];
  stationsrtu: allstationsrtutype[];
  allrtues: string[];
  allLeftbar: allLeftbartype[];
  showAllnetworks: boolean;
  allselectedId: string[];
  regionLinks: allregionlinkstype[];
  defaultregionLinks: alldefaultregionlinkstype[];
  selectedstations: selectedstationtype[];
  selecteddefaultstations: selecteddefaultstationtype[];
  selectedlinks: selectedlinktype[];
  selectedefaultdlinks: selecteddefaultlinktype[];
  selectedid: string;
  loading: boolean;
  networkidadmin: string[];
  regionidadmin: string[];
  datadetailStatus: boolean;
  mount: boolean;
};
const initialState: initialStatetype = {
  networkidadmin: [],
  regionidadmin: [],
  networkslist: [],
  leftbarStationcheckboxlist: [],
  networkregions: [],
  regionstations: [],
  defaultregionstations: [],
  defaultregionLinks: [],
  regionLinks: [],
  stationsrtu: [],
  allrtues: [],
  allLeftbar: [],
  showAllnetworks: false,
  allselectedId: [],
  selectedstations: [],
  selectedlinks: [],
  selectedid: '',
  selecteddefaultstations: [],
  selectedefaultdlinks: [],
  loading: false,
  datadetailStatus: false,
  mount: false,
};

const networktreeslice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setMount: (state, action: {type: string; payload: boolean}) => {
      state.mount = action.payload;
    },
    setNetworklist: (state, action: networklisttype) => {
      state.networkslist = action.payload;
    },
    setallLeftbar: (
      state,
      action: {type: string; payload: allLeftbartype[]},
    ) => {
      state.allLeftbar = action.payload;
    },
    setleftbarStationcheckboxlist: (
      state,
      action: {payload: leftbarStationcheckboxlist; type: string},
    ) => {
      state.leftbarStationcheckboxlist = action.payload;
    },
    setNetworkregions: (state, action: networkregionstype) => {
      state.networkregions = action.payload;
    },
    setNetworkidadmin: (state, action: {type: string; payload: string}) => {
      let networkidadminCopy = deepcopy(state.networkidadmin);
      const findinlist = state.networkidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        networkidadminCopy.push(action.payload);
      }
      state.networkidadmin = networkidadminCopy;
    },
    setRegionidadmin: (state, action: {type: string; payload: string}) => {
      const findinlist = state.regionidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        state.regionidadmin.push(action.payload);
      }
    },
    deletenetwork: (state, action: {type: string; payload: string}) => {
      const newnetworkslist = state.networkslist.filter(
        data => data.id != action.payload,
      );
      const newnetworkregionlist = state.networkregions.filter(
        data => data.networkid != action.payload,
      );
      const newregionstations = state.regionstations.filter(
        data => data.networkid != action.payload,
      );
      const newregionLinks = state.regionLinks.filter(
        data => data.networkid != action.payload,
      );
      const newdefaultregionstations = state.defaultregionstations.filter(
        data => data.networkid != action.payload,
      );
      const newdefaultregionLinks = state.defaultregionLinks.filter(
        data => data.networkid != action.payload,
      );
      state.networkslist = newnetworkslist;
      state.networkregions = newnetworkregionlist;
      state.regionstations = newregionstations;
      state.regionLinks = newregionLinks;
      state.defaultregionstations = newdefaultregionstations;
      state.defaultregionLinks = newdefaultregionLinks;
    },

    setRegionstations: (state, action: regionstationstype) => {
      state.regionstations = action.payload;
    },

    setdefaultRegionstations: (state, action: defaultregionstationstype) => {
      console.log('🧟', action.payload);

      const defaultregionStationsCopy = deepcopy(state.defaultregionstations);
      const finddataindex = state.defaultregionstations.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (finddataindex > -1) {
        console.log('ok');

        defaultregionStationsCopy[finddataindex].stations =
          action.payload.stations;
      } else {
        console.log('no');
        defaultregionStationsCopy.push(action.payload);
      }
      state.defaultregionstations = defaultregionStationsCopy;
    },

    setRegionLinks: (state, action: regionlinkstype) => {
      state.regionLinks = action.payload;
    },

    setdefaultRegionLinks: (state, action: defaultregionlinkstype) => {
      const defaultregionLinksCopy = deepcopy(state.defaultregionLinks);
      const finddataindex = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload?.networkid,
      );
      if (finddataindex > -1) {
        defaultregionLinksCopy[finddataindex].links = action.payload.links;
      } else {
        defaultregionLinksCopy.push(action.payload);
      }

      state.defaultregionLinks = defaultregionLinksCopy;
    },

    createdefaultRegionLinks: (
      state,
      action: {
        type: string;
        payload: {
          networkid: string;
          links: {
            name: string;
            id: string;
            source_id: string;
            destination_id: string;
          };
        };
      },
    ) => {
      const defaultregionLinksCopy = deepcopy(state.defaultregionLinks);
      const finddataindex = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (finddataindex > -1) {
        defaultregionLinksCopy[finddataindex].links.push(action.payload.links);
      } else {
        defaultregionLinksCopy.push({
          networkid: action.payload.networkid,
          links: [
            {
              id: action.payload.links.id,
              name: action.payload.links.name,
              source_id: action.payload.links.source_id,
              destination_id: action.payload.links.destination_id,
            },
          ],
        });
      }

      state.defaultregionLinks = defaultregionLinksCopy;
    },

    setStationsrtu: (state, action: stationsrtutype) => {
      state.stationsrtu = action.payload;
    },
    setShowallnetworks: (state, action) => {
      state.showAllnetworks = action.payload;
    },
    setSelectedid: (state, action: {payload: string; type: string}) => {
      state.selectedid = action.payload;
    },
    // ---------------------------------------------------------
    setAllselectedId: (state, action) => {
      const findId = state.allselectedId.findIndex(
        data => data == action.payload,
      );
      let allselectedIdCopy: string[] = deepcopy(state.allselectedId);
      if (findId > -1) {
        const newlist = allselectedIdCopy.filter(
          data => data != action.payload,
        );
        state.allselectedId = newlist;
      } else {
        allselectedIdCopy.push(action.payload);
        state.allselectedId = allselectedIdCopy;
      }
    },

    //  -----------------------------
    onclickstationcheckbox: (
      state,
      action: {
        payload: {networkid: string; regionid: string; stationid: string};
        type: string;
      },
    ) => {
      let selectedstationsCopy: selectedstationtype[] = deepcopy(
        state.selectedstations,
      );
      const findregioniddex = selectedstationsCopy.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      if (findregioniddex > -1) {
        let findstationidindex = selectedstationsCopy[
          findregioniddex
        ].stationsID.findIndex(data => data == action.payload.stationid);
        if (findstationidindex > -1) {
          let newstationlist = selectedstationsCopy[
            findregioniddex
          ].stationsID.filter(data => data != action.payload.stationid);
          selectedstationsCopy[findregioniddex].stationsID = newstationlist;
        } else {
          selectedstationsCopy[findregioniddex].stationsID.push(
            action.payload.stationid,
          );
        }
      } else {
        selectedstationsCopy.push({
          networkid: action.payload.networkid,
          regionid: action.payload.regionid,
          stationsID: [action.payload.stationid],
        });
      }
      state.selectedstations = selectedstationsCopy;
    },
    //  -----------------------------
    onclickdefaultstationcheckbox: (
      state,
      action: {
        payload: {networkid: string; stationid: string};
        type: string;
      },
    ) => {
      let selecteddefaultstationsCopy: selecteddefaultstationtype[] = deepcopy(
        state.selecteddefaultstations,
      );
      const findregioniddex = selecteddefaultstationsCopy.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (findregioniddex > -1) {
        let findstationidindex = selecteddefaultstationsCopy[
          findregioniddex
        ].stationsID.findIndex(data => data == action.payload.stationid);
        if (findstationidindex > -1) {
          let newstationlist = selecteddefaultstationsCopy[
            findregioniddex
          ].stationsID.filter(data => data != action.payload.stationid);
          selecteddefaultstationsCopy[findregioniddex].stationsID =
            newstationlist;
        } else {
          selecteddefaultstationsCopy[findregioniddex].stationsID.push(
            action.payload.stationid,
          );
        }
      } else {
        selecteddefaultstationsCopy.push({
          networkid: action.payload.networkid,
          stationsID: [action.payload.stationid],
        });
      }
      state.selecteddefaultstations = selecteddefaultstationsCopy;
    },
    //  -----------------------------
    onclicklinkcheckbox: (
      state,
      action: {
        payload: {networkid: string; regionid: string; linkid: string};
        type: string;
      },
    ) => {
      let selectedlinksCopy: selectedlinktype[] = deepcopy(state.selectedlinks);
      const findregioniddex = selectedlinksCopy.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      if (findregioniddex > -1) {
        let findstationidindex = selectedlinksCopy[
          findregioniddex
        ].linkID.findIndex(data => data == action.payload.linkid);
        if (findstationidindex > -1) {
          let newstationlist = selectedlinksCopy[findregioniddex].linkID.filter(
            data => data != action.payload.linkid,
          );
          selectedlinksCopy[findregioniddex].linkID = newstationlist;
        } else {
          selectedlinksCopy[findregioniddex].linkID.push(action.payload.linkid);
        }
      } else {
        selectedlinksCopy.push({
          networkid: action.payload.networkid,
          regionid: action.payload.regionid,
          linkID: [action.payload.linkid],
        });
      }
      state.selectedlinks = selectedlinksCopy;
    },
    //  -----------------------------
    onclickdefaultlinkcheckbox: (
      state,
      action: {
        payload: {networkid: string; linkid: string};
        type: string;
      },
    ) => {
      let selecteddefaultlinksCopy: selecteddefaultlinktype[] = deepcopy(
        state.selectedefaultdlinks,
      );
      const findregioniddex = selecteddefaultlinksCopy.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (findregioniddex > -1) {
        let findstationidindex = selecteddefaultlinksCopy[
          findregioniddex
        ].linkID.findIndex(data => data == action.payload.linkid);
        if (findstationidindex > -1) {
          let newstationlist = selecteddefaultlinksCopy[
            findregioniddex
          ].linkID.filter(data => data != action.payload.linkid);
          selecteddefaultlinksCopy[findregioniddex].linkID = newstationlist;
        } else {
          selecteddefaultlinksCopy[findregioniddex].linkID.push(
            action.payload.linkid,
          );
        }
      } else {
        selecteddefaultlinksCopy.push({
          networkid: action.payload.networkid,
          linkID: [action.payload.linkid],
        });
      }
      state.selectedefaultdlinks = selecteddefaultlinksCopy;
    },
    //  -----------------------------
    createRegion: (state, action: createregiontype) => {
      const networkRegionCopy = deepcopy(state.networkregions);
      const fintnetwork = state.networkregions.findIndex(
        data => data.networkid == action.payload.networkid,
      );

      if (fintnetwork > -1) {
        networkRegionCopy[fintnetwork].regions.push({
          id: action.payload.regionid,
          name: action.payload.regionname,
        });
      } else {
        networkRegionCopy.push({
          networkid: action.payload.networkid,
          regions: [
            {id: action.payload.regionid, name: action.payload.regionname},
          ],
        });
      }

      state.networkregions = networkRegionCopy;
    },
    //  -----------------------------
    createStation: (state, action: createStationtype) => {
      const regionStationcopy = deepcopy(state.regionstations);
      const findregionstationinddex = state.regionstations.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      if (findregionstationinddex > -1) {
        regionStationcopy[findregionstationinddex].stations.push({
          id: action.payload.stationid,
          name: action.payload.stationname,
        });
      } else {
        regionStationcopy.push({
          networkid: action.payload.networkid,
          regionid: action.payload.regionid,
          stations: [
            {id: action.payload.stationid, name: action.payload.stationname},
          ],
        });
      }

      state.regionstations = regionStationcopy;
    },
    //  -----------------------------
    createdefaultStation: (
      state,
      action: {
        payload: {
          networkid: string;
          stationid: string;
          stationname: string;
        };
        type: string;
      },
    ) => {
      const regiondefaultStationcopy = deepcopy(state.defaultregionstations);
      const findregionstationinddex = state.defaultregionstations.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (findregionstationinddex > -1) {
        regiondefaultStationcopy[findregionstationinddex].stations.push({
          id: action.payload.stationid,
          name: action.payload.stationname,
        });
      } else {
        regiondefaultStationcopy.push({
          networkid: action.payload.networkid,
          stations: [
            {id: action.payload.stationid, name: action.payload.stationname},
          ],
        });
      }

      state.defaultregionstations = regiondefaultStationcopy;
    },
    //  -----------------------------
    createLinks: (state, action: createLinktype) => {
      const regionLinkcopy = deepcopy(state.regionLinks);
      const findregionlinkddex = state.regionLinks.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      if (findregionlinkddex > -1) {
        regionLinkcopy[findregionlinkddex].links.push({
          id: action.payload.linkid,
          name: action.payload.linkname,
          source_id: action.payload.source_id,
          destination_id: action.payload.destination_id,
        });
      } else {
        regionLinkcopy.push({
          networkid: action.payload.networkid,
          regionid: action.payload.regionid,
          links: [
            {
              id: action.payload.linkid,
              name: action.payload.linkname,
              source_id: action.payload.source_id,
              destination_id: action.payload.destination_id,
            },
          ],
        });
      }

      state.regionLinks = regionLinkcopy;
    },
    //  -----------------------------
    createnetwork: (state, action: createnetworkType) => {
      let networklistCopy = deepcopy(state.networkslist);
      networklistCopy.push(action.payload);
      state.networkslist = networklistCopy;
    },
    //  -----------------------------
    updatelinkname: (
      state,
      action: {
        type: string;
        payload: {
          networkid: string;
          newregionid: string;
          regionid: string;
          linkid: string;
          linkname: string;
          source_id: string;
          destination_id: string;
        };
      },
    ) => {
      let regionLinksCopy: allregionlinkstype[] = deepcopy(state.regionLinks);
      const findwithregionindex = state.regionLinks.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      const findlinkid = regionLinksCopy[findwithregionindex].links.findIndex(
        (data: {id: string; name: string}) => data.id == action.payload.linkid,
      );
      regionLinksCopy[findwithregionindex].links[findlinkid].name =
        action.payload.linkname;

      if (action.payload.regionid != action.payload.newregionid) {
        const findwithnewregionindex = state.regionLinks.findIndex(
          data => data.regionid == action.payload.newregionid,
        );
        if (findwithnewregionindex > -1) {
          regionLinksCopy[findwithnewregionindex].links.push({
            id: action.payload.linkid,
            name: action.payload.linkname,
            source_id: action.payload.source_id,
            destination_id: action.payload.destination_id,
          });
        } else {
          //   type allregionlinkstype = {
          //     networkid: string;
          //     regionid: string;
          //     links: {
          //         name: string;
          //         id: string;
          //     }[];
          // }
          regionLinksCopy.push({
            networkid: action.payload.networkid,
            regionid: action.payload.newregionid,
            links: [
              {
                id: action.payload.linkid,
                name: action.payload.linkname,
                source_id: action.payload.source_id,
                destination_id: action.payload.destination_id,
              },
            ],
          });
        }
        regionLinksCopy[findwithregionindex].links.splice(findlinkid, 1);

        // ******************************
        const getstationdetail = async () => {
          const [sourcedetailresponse, destinationdetailresponse] =
            await Promise.all([
              $Get(`otdr/station/${action.payload.source_id}`),
              $Get(`otdr/station/${action.payload.destination_id}`),
            ]);

          const sourceresponsedata = await sourcedetailresponse?.json();
          const destinationresponsedata =
            await destinationdetailresponse?.json();
          let soursedetaildata = sourceresponsedata?.versions?.find(
            (version: any) =>
              version.id === sourceresponsedata?.current_version?.id,
          );
          let destinationdetaildata = destinationresponsedata?.versions?.find(
            (version: any) =>
              version.id === destinationresponsedata?.current_version?.id,
          );
          // When we change the regionid of a link, we must transfer the stations of that link to the defaultregion, meaning we set their regionid to null.
          const updatesource = await $Put(
            `otdr/station/${action.payload.source_id}`,
            {
              region_id: null,
              longitude: soursedetaildata.longitude,
              latitude: soursedetaildata.latitude,
              description: soursedetaildata.description,
              name: sourceresponsedata.name,
              rtu_placement: sourceresponsedata.rtu_placement,
            },
          );
          const updatedestination = await $Put(
            `otdr/station/${action.payload.destination_id}`,
            {
              region_id: null,
              longitude: destinationdetaildata.longitude,
              latitude: destinationdetaildata.latitude,
              description: destinationdetaildata.description,
              name: destinationresponsedata.name,
              rtu_placement: destinationresponsedata.rtu_placement,
            },
          );
        };

        getstationdetail();
        state.allselectedId = [
          action.payload.networkid,
          action.payload.newregionid,
          action.payload.regionid,
        ];
      }
      state.regionLinks = regionLinksCopy;
    },
    //  -----------------------------
    updatedefaltlinkname: (
      state,
      action: {
        type: string;
        payload: {
          networkid: string;
          regionid: string | null;
          linkid: string;
          linkname: string;
          source_id: string;
          destination_id: string;
        };
      },
    ) => {
      let defaultregionLinksCopy = deepcopy(state.defaultregionLinks);

      const findwithregionindex = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (action.payload.regionid == null) {
        const findlinkid = defaultregionLinksCopy[
          findwithregionindex
        ].links.findIndex(
          (data: {id: string; name: string}) =>
            data.id == action.payload.linkid,
        );
        defaultregionLinksCopy[findwithregionindex].links[findlinkid].name =
          action.payload.linkname;
        defaultregionLinksCopy[findwithregionindex].links[
          findlinkid
        ].source_id = action.payload.source_id;
        defaultregionLinksCopy[findwithregionindex].links[
          findlinkid
        ].destination_id = action.payload.destination_id;
      } else {
        const findlinkid = defaultregionLinksCopy[
          findwithregionindex
        ].links.findIndex(
          (data: {id: string; name: string}) =>
            data.id == action.payload.linkid,
        );
        defaultregionLinksCopy[findwithregionindex].links.splice(findlinkid, 1);
        let regionLinksCopy: allregionlinkstype[] = deepcopy(state.regionLinks);
        // const findwithregionindex = state.regionLinks.findIndex(
        //   data => data.regionid == action.payload.regionid,
        // );

        const findwithregionindexinReegionlink = state.regionLinks.findIndex(
          data => data.regionid == action.payload.regionid,
        );
        // const findlinkidinRegionId = regionLinksCopy[
        //   findwithregionindexinReegionlink
        // ].links.findIndex(
        //   (data: {id: string; name: string}) =>
        //     data.id == action.payload.linkid,
        // );
        if (findwithregionindexinReegionlink > -1) {
          regionLinksCopy[findwithregionindexinReegionlink].links.push({
            id: action.payload.linkid,
            name: action.payload.linkname,
            source_id: action.payload.source_id,
            destination_id: action.payload.destination_id,
          });
        } else {
          regionLinksCopy.push({
            networkid: action.payload.networkid,
            regionid: action.payload.regionid,
            links: [
              {
                id: action.payload.linkid,
                name: action.payload.linkname,
                source_id: action.payload.source_id,
                destination_id: action.payload.destination_id,
              },
            ],
          });
        }
        state.regionLinks = regionLinksCopy;
      }

      state.defaultregionLinks = defaultregionLinksCopy;
    },
    //  ----------------------------
    updateStationName: (state, action: updateStationnametype) => {
      // state.loading = true;
      let regionStationsCopy = deepcopy(state.regionstations);
      let regionlinksCopy: allregionlinkstype[] = deepcopy(state.regionLinks);
      let regiondefaultlinksCopy: alldefaultregionlinkstype[] = deepcopy(
        state.defaultregionLinks,
      );
      const findwithregionindex = state.regionstations.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      const findwithnewregionindex = state.regionstations.findIndex(
        data => data.regionid == action.payload.newregionid,
      );
      let status = false;
      const findstationid = regionStationsCopy[
        findwithregionindex
      ].stations.findIndex(
        (data: {id: string; name: string}) =>
          data.id == action.payload.stationid,
      );
      // First, we change the name of the station.
      regionStationsCopy[findwithregionindex].stations[findstationid].name =
        action.payload.stationname;
      // Then we check if the station's regionid has changed, and if it has, we transfer that station to the new region
      if (action.payload.regionid != action.payload.newregionid) {
        const findindefaultlinks = regiondefaultlinksCopy.findIndex(
          data => data.networkid == action.payload.networkid,
        );

        if (findindefaultlinks > -1) {
          // Initially, we check whether we have previously changed the station for this link or not! If we have changed it, the link has gone to the defaultregion section
          const defaultlinkwithstationid = regiondefaultlinksCopy[
            findindefaultlinks
          ].links.find(
            data =>
              data.destination_id == action.payload.stationid ||
              data.source_id == action.payload.stationid,
          );
          console.log('33333', defaultlinkwithstationid);
          let linkstations = [
            defaultlinkwithstationid?.source_id,
            defaultlinkwithstationid?.destination_id,
          ];

          let newlinkstations = linkstations.filter(
            data => data != action.payload.stationid,
          );

          if (findwithnewregionindex > -1) {
            for (
              let i = 0;
              i < regionStationsCopy[findwithnewregionindex].stations.length;
              i++
            ) {
              if (
                regionStationsCopy[findwithnewregionindex].stations[i].id ==
                newlinkstations[0]
              ) {
                status = true;
              }
            }
          }

          if (status) {
            // Then we check if the regionid of both stations is the same, if so, we transfer the link to the new region
            const updatelinkwithnewregionid = async () => {
              try {
                const linkDetails = await $Get(
                  `otdr/link/${defaultlinkwithstationid!.id!}`,
                );
                const linkDetailsdata = await linkDetails?.json();
                const findversion = linkDetailsdata?.versions?.find(
                  (version: any) =>
                    version.id === linkDetailsdata?.current_version?.id,
                );

                const updatelinkresponse = await $Put(
                  `otdr/link/${defaultlinkwithstationid?.id}`,
                  {
                    region_id: action.payload.newregionid,
                    description: findversion?.description,
                    link_points: [],
                    source_id: findversion?.source.id,
                    destination_id: findversion?.destination.id,
                    type: findversion?.type,
                    name: linkDetailsdata.name,
                  },
                );
              } catch (error) {
              } finally {
              }
            };
            updatelinkwithnewregionid();
          }
        }

        if (status) {
        } else {
          const findlinkwithregionid = regionlinksCopy.findIndex(
            data => data.regionid == action.payload.regionid,
          );
          if (findlinkwithregionid > -1) {
            const findlinkwithstatonid = regionlinksCopy[
              findlinkwithregionid
            ].links.find(
              data =>
                data.source_id == action.payload.stationid ||
                data.destination_id == action.payload.stationid,
            );

            const updatelink = async () => {
              // If the regionid of one of the stations in the link changes, we set the link's regionid to null and transfer the link to the defaultregion
              try {
                const linkDetails = await $Get(
                  `otdr/link/${findlinkwithstatonid!.id!}`,
                );

                const linkDetailsdata = await linkDetails?.json();
                const findversion = linkDetailsdata?.versions?.find(
                  (version: any) =>
                    version.id === linkDetailsdata?.current_version?.id,
                );
                const updatelinkresponse = await $Put(
                  `otdr/link/${findlinkwithstatonid?.id}`,
                  {
                    region_id: null,
                    description: findversion?.description,
                    link_points: [],
                    source_id: findversion?.source.id,
                    destination_id: findversion?.destination.id,
                    type: findversion?.type,
                    name: linkDetailsdata.name,
                  },
                );
              } catch (error) {
              } finally {
              }
            };
            updatelink();
          } else {
          }
        }

        regionStationsCopy[findwithregionindex].stations.splice(
          findstationid,
          1,
        );
        const findwithnewregionid = regionStationsCopy.findIndex(
          (data: any) => data.regionid == action.payload.newregionid,
        );
        if (findwithnewregionid > -1) {
          regionStationsCopy[findwithnewregionid].stations.push({
            name: action.payload.stationname,
            id: action.payload.stationid,
          });
        } else {
          regionStationsCopy.push({
            networkid: action.payload.networkid,
            regionid: action.payload.newregionid,
            stations: [
              {
                name: action.payload.stationname,
                id: action.payload.stationid,
              },
            ],
          });
        }

        let newselectedid = [
          action.payload.networkid,
          action.payload.regionid,
          action.payload.newregionid,
        ];
        state.showAllnetworks = true;
        state.allselectedId = newselectedid;

        // *********************
        state.regionLinks = [];
        state.defaultregionLinks = [];
      }
      // state.loading = false;
      state.regionstations = regionStationsCopy;
    },
    // -------------------------------------------------------------
    updatedefaultStationName: (state, action: updatedefaultStationtype) => {
      console.log('🤑', action.payload);
      const regionstationsCopy = deepcopy(state.regionstations);
      let defaultregionstationsCopy = deepcopy(state.defaultregionstations);
      const findstationwithnetworkid = state.defaultregionstations.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      const findstationwithid = state.defaultregionstations[
        findstationwithnetworkid
      ]?.stations?.findIndex(data => data.id == action.payload.stationid);

      if (action?.payload?.regionid != null) {
        defaultregionstationsCopy[findstationwithnetworkid]?.stations?.splice(
          findstationwithid,
          1,
        );

        const findregionstations = state.regionstations.findIndex(
          data =>
            data.networkid == action.payload.networkid &&
            data.regionid == action.payload.regionid,
        );
        if (findregionstations > -1) {
          regionstationsCopy[findregionstations]?.stations?.push({
            name: action.payload.stationname,
            id: action.payload.stationid,
          });
        } else {
          regionstationsCopy.push({
            networkid: action.payload.stationid,
            regionid: action.payload.regionid,
            stations: [
              {name: action.payload.stationname, id: action.payload.stationid},
            ],
          });
        }
      } else {
        defaultregionstationsCopy[findstationwithnetworkid].stations[
          findstationwithid
        ].name = action.payload.stationname;
      }

      state.defaultregionstations = defaultregionstationsCopy;
      state.regionstations = regionstationsCopy;
    },
    //---------------------------------
    updateregionname: (state, action: changeRegion) => {
      const networkregionsCopy = deepcopy(state.networkregions);
      const fintbynetworkid = state.networkregions.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      const findregionindex = state.networkregions[
        fintbynetworkid
      ].regions.findIndex(data => data.id == action.payload.regionid);
      if (action.payload.networkid != action.payload.newnetworkid) {
        networkregionsCopy[fintbynetworkid].regions.splice(findregionindex, 1);
        const findnewbynetworkid = state.networkregions.findIndex(
          data => data.networkid == action.payload.newnetworkid,
        );

        if (findnewbynetworkid > -1) {
          networkregionsCopy[findnewbynetworkid].regions.push({
            id: action.payload.regionid,
            name: action.payload.regionname,
          });
        } else {
          networkregionsCopy.push({
            networkid: action.payload.newnetworkid,
            regions: [
              {
                name: action.payload.regionname,
                id: action.payload.regionid,
              },
            ],
          });
        }
      } else {
        networkregionsCopy[fintbynetworkid].regions[findregionindex].name =
          action.payload.regionname;
      }
      state.networkregions = networkregionsCopy;
    },
    //---------------------------------------------
    changeNetworkname: (state, action: createnetworkType) => {
      const networklistCopy = deepcopy(state.networkslist);
      const findnetworkindex = state.networkslist.findIndex(
        data => data.id == action.payload.id,
      );
      networklistCopy[findnetworkindex].name = action.payload.name;
      state.networkslist = networklistCopy;
    },
    //---------------------------------------------
    deletegroupstation: (state, action: deletegroupstationtype) => {
      const regionstationsCopy = deepcopy(state.regionstations);
      const regionlinksCopy = deepcopy(state.regionLinks);
      const defaulregionlinksCopy = deepcopy(state.defaultregionLinks);
      const allselectedIdCopy = deepcopy(state.allselectedId);
      const findstations = state.regionstations.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      let newtlist = [];
      for (
        let i = 0;
        i < regionstationsCopy[findstations].stations.length;
        i++
      ) {
        if (
          action.payload.stationsid.findIndex(
            data => data == regionstationsCopy[findstations].stations[i].id,
          ) < 0
        ) {
          newtlist.push(regionstationsCopy[findstations].stations[i]);
        }
      }

      regionstationsCopy[findstations].stations = newtlist;
      const newselectedstations = state.selectedstations.filter(
        data => data.regionid != action.payload.regionid,
      );
      const finldregionlinks = regionlinksCopy.findIndex(
        (data: any) => data.regionid == action.payload.regionid,
      );
      if (finldregionlinks > -1) {
        regionlinksCopy[finldregionlinks].links = [];
      }
      state.regionLinks = regionlinksCopy;
      state.allselectedId = allselectedIdCopy
        .filter(
          // (!data.includes(`_Links`) &&  !data.includes(`${action.payload.networkid}`))
          (data: string) =>
            data !=
            `${action.payload.regionid}&${action.payload.regionid}_Linkss`,
        )
        .filter(
          (data: string) =>
            data !=
            `&${action.payload.networkid}&${action.payload.networkid}_Linkss`,
        );
      const finlindefaultregion = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (finlindefaultregion > -1) {
        defaulregionlinksCopy[finlindefaultregion].links = [];
      }
      state.defaultregionLinks = defaulregionlinksCopy;
      // state.regionLinks=[]
      state.regionstations = regionstationsCopy;
      state.selectedstations = newselectedstations;
    },
    //---------------------------------------------
    deletedefaultgroupstation: (
      state,
      action: deletedefaultgroupstationtype,
    ) => {
      const allselectedIdCopy = deepcopy(state.allselectedId);
      const regionstationsCopy = deepcopy(state.defaultregionstations);
      const findstations = state.defaultregionstations.findIndex(
        data => data.networkid == action.payload.networkid,
      );

      let newtlist = [];
      for (
        let i = 0;
        i < regionstationsCopy[findstations].stations.length;
        i++
      ) {
        if (
          action.payload.stationsid.findIndex(
            data => data == regionstationsCopy[findstations].stations[i].id,
          ) < 0
        ) {
          newtlist.push(regionstationsCopy[findstations].stations[i]);
        }
      }
      regionstationsCopy[findstations].stations = newtlist;
      const newselectedstations = state.selecteddefaultstations.filter(
        data => data.networkid != action.payload.networkid,
      );
      state.allselectedId = allselectedIdCopy.filter(
        (data: string) => !data.includes(`_Links`),
      );
      state.defaultregionLinks = [];
      state.regionLinks = [];
      state.defaultregionstations = regionstationsCopy;
      state.selecteddefaultstations = newselectedstations;
    },
    //---------------------------------------------
    deletegrouplinks: (state, action: deletegrouplinktype) => {
      const regionlinksCopy = deepcopy(state.regionLinks);
      const findlinks = state.regionLinks.findIndex(
        data => data.regionid == action.payload.regionid,
      );

      let newtlist = [];
      for (let i = 0; i < regionlinksCopy[findlinks].links.length; i++) {
        if (
          action.payload.linksid.findIndex(
            data => data == regionlinksCopy[findlinks].links[i].id,
          ) < 0
        ) {
          newtlist.push(regionlinksCopy[findlinks].links[i]);
        }
      }
      regionlinksCopy[findlinks].links = newtlist;
      const newselectedlinks = state.selectedlinks.filter(
        data => data.regionid != action.payload.regionid,
      );
      state.regionLinks = regionlinksCopy;
      state.selectedlinks = newselectedlinks;
    },
    //---------------------------------------------
    deletedefaultgrouplinks: (state, action: deletedefaultgrouplinktype) => {
      const regionlinksCopy = deepcopy(state.defaultregionLinks);
      const findlinks = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );

      let newtlist = [];
      for (let i = 0; i < regionlinksCopy[findlinks].links.length; i++) {
        if (
          action.payload.linksid.findIndex(
            data => data == regionlinksCopy[findlinks].links[i].id,
          ) < 0
        ) {
          newtlist.push(regionlinksCopy[findlinks].links[i]);
        }
      }
      regionlinksCopy[findlinks].links = newtlist;
      const newselectedlinks = state.selectedefaultdlinks.filter(
        data => data.networkid != action.payload.networkid,
      );
      state.defaultregionLinks = regionlinksCopy;
      state.selectedefaultdlinks = newselectedlinks;
    },
    //---------------------------------------------
    deleteRegion: (
      state,
      action: {payload: {regionid: string; networkid: string}; type: string},
    ) => {
      const defaultregionstationsCopy = deepcopy(state.defaultregionstations);
      const defaultregionlinksCopy = deepcopy(state.defaultregionLinks);
      const regionstationsCopy = deepcopy(state.regionstations);
      const findregionstation = regionstationsCopy.find(
        (data: any) => data.regionid == action.payload.regionid,
      );

      const finddefaultregionstation = defaultregionstationsCopy.findIndex(
        (data: any) => data.networkid == action.payload.networkid,
      );

      const findregionlink = state.regionLinks.find(
        data => data.regionid == action.payload.regionid,
      );

      const finddefaultregionlink = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );

      if (finddefaultregionlink > -1) {
        defaultregionlinksCopy[finddefaultregionlink].links = [
          ...defaultregionlinksCopy[finddefaultregionlink].links,
          ...findregionlink!.links,
        ];
      } else {
        defaultregionlinksCopy.push(findregionlink);
      }
      if (finddefaultregionstation > -1) {
        defaultregionstationsCopy[finddefaultregionstation].stations = [
          ...defaultregionstationsCopy[finddefaultregionstation].stations,
          ...findregionstation!.stations,
        ];
      } else {
        defaultregionstationsCopy.push(findregionstation);
      }

      const newnetworkregions = state.networkregions.filter(
        data => data.networkid != action.payload.networkid,
      );
      const newallselectedid = state.allselectedId.filter(
        data => data != action.payload.networkid,
      );
      const newregionlinks = state.regionLinks.filter(
        data => data.regionid != action.payload.regionid,
      );

      const newregionstations = state.regionstations.filter(
        data => data.regionid != action.payload.regionid,
      );

      state.allselectedId = newallselectedid;
      state.regionLinks = newregionlinks;
      state.regionstations = newregionstations;
      state.networkregions = newnetworkregions;
      state.defaultregionstations = defaultregionstationsCopy;
      state.defaultregionLinks = defaultregionlinksCopy;
    },

    //---------------------------------------------
    deletedefaultRegion: (
      state,
      action: {payload: {networkid: string}; type: string},
    ) => {
      const newdefaultlinks = state.defaultregionLinks.filter(
        data => data.networkid != action.payload.networkid,
      );
      const newdefaultstation = state.defaultregionstations.filter(
        data => data.networkid != action.payload.networkid,
      );
      state.defaultregionLinks = newdefaultlinks;
      state.defaultregionstations = newdefaultstation;
    },
    // ------------------------------------------------
    chageLoading: (state, action: {payload: boolean; type: string}) => {
      state.loading = action.payload;
    },
    // ------------------------------------------------
    changegetdatadetailStatus: (
      state,
      action: {payload: boolean; type: string},
    ) => {
      state.datadetailStatus = action.payload;
    },
  },
});

export const {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
  setleftbarStationcheckboxlist,
  setallLeftbar,
  setShowallnetworks,
  setAllselectedId,
  setRegionLinks,
  onclickstationcheckbox,
  onclicklinkcheckbox,
  createRegion,
  createStation,
  setNetworklist,
  createnetwork,
  createLinks,
  updatelinkname,
  updateStationName,
  updateregionname,
  changeNetworkname,
  setSelectedid,
  deletegroupstation,
  deletegrouplinks,
  deleteRegion,
  setdefaultRegionLinks,
  setdefaultRegionstations,
  deletedefaultgroupstation,
  onclickdefaultstationcheckbox,
  onclickdefaultlinkcheckbox,
  deletedefaultgrouplinks,
  deletenetwork,
  deletedefaultRegion,
  createdefaultRegionLinks,
  updatedefaltlinkname,
  createdefaultStation,
  updatedefaultStationName,
  setNetworkidadmin,
  setRegionidadmin,
  chageLoading,
  changegetdatadetailStatus,
  setMount
} = networktreeslice.actions;

export default networktreeslice.reducer;
