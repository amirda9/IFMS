import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {boolean, object, string} from 'yup';
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
export type defaultregionstationstype = {
  payload: {networkid: string; stations: {name: string; id: string}[]};
  type: string;
};
export type alldefaultregionstationstype = {
  networkid: string;
  stations: {name: string; id: string}[];
};
export type allstationsrtutype = {
  stationid: string;
  regionid: string;
  networkid: string;
  rtues: {name: string; id: string}[];
  deletertues: string[];
};



export type alldefaultstationsrtutype = {
  stationid: string;
  networkid: string;
  rtues: {name: string; id: string}[];
  deletertues: string[];
};
export type stationsrtutype = {
  payload: allstationsrtutype[];
  type: string;
};
export type defaultstationsrtutype = {
  payload: alldefaultstationsrtutype[];
  type: string;
};
export type allnetworkregionstype = {
  networkid: string;
  regions: {name: string; id: string}[];
};

export type allregionstationstype = {
  regionid: string;
  stations: {name: string; id: string}[];
};
export type alldefaulregionstationstype = {
  networkid: string;
  stations: {name: string; id: string}[];
};
type leftbarStationcheckboxlist = {
  length: number;
  stationid: string;
  rtues: string[];
}[];
export type initialStatetype = {
  leftbarStationcheckboxlist: leftbarStationcheckboxlist;
  networkregions: allnetworkregionstype[];
  regionstations: allregionstationstype[];
  defaultregionstations: alldefaultregionstationstype[];
  stationsrtu: allstationsrtutype[];
  defaultstationsrtu: alldefaultstationsrtutype[];
  allrtues: string[];
  allLeftbar: allLeftbartype[];
  rtunetworkidadmin: string[];
  rturegionidadmin: string[];
  rtustationidadmin: string[];
  rtugetdetailStatus: boolean;
};
const initialState: initialStatetype = {
  leftbarStationcheckboxlist: [],
  defaultstationsrtu:[],
  defaultregionstations:[],
  networkregions: [],
  regionstations: [],
  stationsrtu: [],
  allrtues: [],
  allLeftbar: [],
  rtunetworkidadmin: [],
  rturegionidadmin: [],
  rtustationidadmin: [],
  rtugetdetailStatus: false,
};

const rtu = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setallLeftbar: (
      state,
      action: {type: string; payload: allLeftbartype[]},
    ) => {
      state.allLeftbar = action.payload;
    },
    // ----------------------------------------------------------------
    setleftbarStationcheckboxlist: (
      state,
      action: {payload: leftbarStationcheckboxlist; type: string},
    ) => {
      state.leftbarStationcheckboxlist = action.payload;
    },
    // ----------------------------------------------------------------
    setNetworkregions: (state, action: networkregionstype) => {
      state.networkregions = action.payload;
    },
    // ----------------------------------------------------------------
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
    // ----------------------------------------------------------------
    setStationsrtu: (state, action: stationsrtutype) => {
      state.stationsrtu = action.payload;
    },

    setdefaultStationsrtu: (state, action: defaultstationsrtutype) => {
      state.defaultstationsrtu = action.payload;
    },
    // ----------------------------------------------------------------
    setRtuNetworkidadmin: (state, action: {type: string; payload: string}) => {
      let networkidadminCopy = deepcopy(state.rtunetworkidadmin);
      const findinlist = state.rtunetworkidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        networkidadminCopy.push(action.payload);
      }
      state.rtunetworkidadmin = networkidadminCopy;
    },
    // ----------------------------------------------------------------
    setRtuRegionidadmin: (state, action: {type: string; payload: string}) => {
      const findinlist = state.rturegionidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        state.rturegionidadmin.push(action.payload);
      }
    },
    // ----------------------------------------------------------------
    setRtuStationidadmin: (state, action: {type: string; payload: string}) => {
      const findinlist = state.rtustationidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        state.rtustationidadmin.push(action.payload);
      }
    },
   // ----------------------------------------------------------------
    setrtugetdetailStatus: (
      state,
      action: {type: string; payload: boolean},
    ) => {
      state.rtugetdetailStatus = action.payload;
    }
  },
});

export const {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
  setleftbarStationcheckboxlist,
  setallLeftbar,
  setRtuNetworkidadmin,
  setRtuRegionidadmin,
  setRtuStationidadmin,
  setrtugetdetailStatus,
  setdefaultRegionstations,
  setdefaultStationsrtu
} = rtu.actions;

export default rtu.reducer;
