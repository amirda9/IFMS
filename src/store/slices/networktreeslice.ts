import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {object, string} from 'yup';
import {deepcopy} from '~/util';
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
  payload: {regionid: string; stations: {name: string; id: string}[]}[];
  type: string;
};

export type regionlinkstype = {
  payload: {regionid: string; links: {name: string; id: string}[]}[];
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

type selectedstationtype = {
  networkid: string;
  regionid: string;
  stationsID: string[];
};

type selectedlinktype = {
  networkid: string;
  regionid: string;
  linkID: string[];
};

type createregiontype = {
  payload: {networkid: string; regionid: string; regionname: string};
  type: string;
};

export type allregionstationstype = {
  regionid: string;
  stations: {name: string; id: string}[];
};
export type allregionlinkstype = {
  regionid: string;
  links: {name: string; id: string}[];
};

type leftbarStationcheckboxlist = {
  length: number;
  stationid: string;
  rtues: string[];
}[];
type createStationtype = {
  payload: {regionid: string; stationid: string; stationname: string};
  type: string;
};

type createLinktype = {
  payload: {regionid: string; linkid: string; linkname: string};
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
  stationsrtu: allstationsrtutype[];
  allrtues: string[];
  allLeftbar: allLeftbartype[];
  showAllnetworks: boolean;
  allselectedId: string[];
  regionLinks: allregionlinkstype[];
  selectedstations: selectedstationtype[];
  selectedlinks: selectedlinktype[];
};
const initialState: initialStatetype = {
  networkslist: [],
  leftbarStationcheckboxlist: [],
  networkregions: [],
  regionstations: [],
  regionLinks: [],
  stationsrtu: [],
  allrtues: [],
  allLeftbar: [],
  showAllnetworks: false,
  allselectedId: [],
  selectedstations: [],
  selectedlinks: [],
};

const networktreeslice = createSlice({
  name: 'type',
  initialState,
  reducers: {
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
    setRegionstations: (state, action: regionstationstype) => {
      state.regionstations = action.payload;
    },
    setRegionLinks: (state, action: regionlinkstype) => {
      state.regionLinks = action.payload;
    },
    setStationsrtu: (state, action: stationsrtutype) => {
      state.stationsrtu = action.payload;
    },
    setShowallnetworks: (state, action) => {
      state.showAllnetworks = action.payload;
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
    createRegion: (state, action: createregiontype) => {
      const networkRegionCopy = deepcopy(state.networkregions);
      const fintnetwork = state.networkregions.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      networkRegionCopy[fintnetwork].regions.push({
        id: action.payload.regionid,
        name: action.payload.regionname,
      });
      state.networkregions = networkRegionCopy;
    },
    //  -----------------------------
    createStation: (state, action: createStationtype) => {
      const regionStationcopy = deepcopy(state.regionstations);
      const findregionstationinddex = state.regionstations.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      regionStationcopy[findregionstationinddex].stations.push({
        id: action.payload.stationid,
        name: action.payload.stationname,
      });
      state.regionstations = regionStationcopy;
    },
    //  -----------------------------
    createLinks: (state, action: createLinktype) => {
      const regionLinkcopy = deepcopy(state.regionLinks);
      const findregionlinkddex = state.regionLinks.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      regionLinkcopy[findregionlinkddex].links.push({
        id: action.payload.linkid,
        name: action.payload.linkname,
      });
      state.regionLinks = regionLinkcopy;
    },
    //  -----------------------------
    createnetwork: (state, action: createnetworkType) => {
      let networklistCopy = deepcopy(state.networkslist);
      networklistCopy.push(action.payload);
      state.networkslist = networklistCopy;
    },
    //  -----------------------------
    updatelinkname: (state, action: createLinktype) => {
      let regionLinksCopy = deepcopy(state.regionLinks);
      const findwithregionindex = state.regionLinks.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      const findlinkid = regionLinksCopy[findwithregionindex].links.findIndex(
        (data: {id: string; name: string}) => data.id == action.payload.linkid,
      );
      regionLinksCopy[findwithregionindex].links[findlinkid].name =
        action.payload.linkname;
      state.regionLinks = regionLinksCopy;
    },
    //  ----------------------------
    updateStationName: (state, action: createStationtype) => {
      let regionStationsCopy = deepcopy(state.regionstations);
      const findwithregionindex = state.regionstations.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      const findstationid = regionStationsCopy[findwithregionindex].stations.findIndex(
        (data: {id: string; name: string}) => data.id == action.payload.stationid,
      );
      regionStationsCopy[findwithregionindex].stations[findstationid].name =
        action.payload.stationname;
      state.regionstations = regionStationsCopy;
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
  updateStationName
} = networktreeslice.actions;

export default networktreeslice.reducer;
