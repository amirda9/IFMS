import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {object, string} from 'yup';
export enum statustype {
  TRUE="true",
  FALSE="false",
  NONE="none"
}

 export type allLeftbartype={
  networkId:string,name:string,check:statustype,open:boolean,Length:number,Max:number,MainRtues:string[],Rtues:string[],Regions:{name: string; id: string,open:boolean,check:statustype,Length:number,Max:number,MainRtues:string[],Rtues:string[],Stations:{stationId:string,check:statustype,open:boolean ,Length:number,Max:number,MainRtues:string[],Rtues:string[]}[]}[]
 }
export type stationtype={stationid: string; check:boolean}

export type regiontype={
  check:boolean;
  regionid: string;
  Length:number;
  station: stationtype[];
}
export type rtuleftbar = {
  Length:number
  networkid: string;
  check:boolean,
  region:regiontype[];
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

export type allstationsrtutype=
  {stationid: string; rtues: {name: string; id: string}[]}
  
export type stationsrtutype = {
  payload: allstationsrtutype[];
  type: string;
};

export  type allnetworkregionstype= {
  networkid: string;
  regions: {name: string; id: string}[];
}


export type allregionstationstype={regionid: string; stations: {name: string; id: string}[]}


type leftbarNetworkcheckboxlisttype={length:number,networkid:string,rtues:string[]}[]
type leftbarRegioncheckboxlist={length:number,regionid:string,rtues:string[]}[]
type leftbarStationcheckboxlist={length:number,stationid:string,rtues:string[]}[]
export type initialStatetype={
  leftbarcheckboxlist:rtuleftbar[]
  leftbarNetworkcheckboxlist:leftbarNetworkcheckboxlisttype
  leftbarRegioncheckboxlist:leftbarRegioncheckboxlist
  leftbarStationcheckboxlist:leftbarStationcheckboxlist
  networkregions:allnetworkregionstype[]
  regionstations:allregionstationstype[]
  stationsrtu:allstationsrtutype[]
  allrtues:string[]
  allLeftbar:allLeftbartype[]
}
const initialState:initialStatetype = {
  leftbarcheckboxlist: [],
  leftbarNetworkcheckboxlist: [],
  leftbarRegioncheckboxlist: [],
  leftbarStationcheckboxlist: [],
  networkregions: [],
  regionstations: [],
  stationsrtu: [],
  allrtues:[],
  allLeftbar:[]

} ;




const rtu = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setallLeftbar: (state, action: {type:string,payload:allLeftbartype[]}) => {
      state.allLeftbar = action.payload;
    },
    setleftbarcheckboxlist: (state, action: leftbarcheckboxlisttype) => {
      state.leftbarcheckboxlist = action.payload;
    },
    setleftbarNetworkcheckboxlist: (state, action: {payload:leftbarNetworkcheckboxlisttype,type:string}) => {
     state.leftbarNetworkcheckboxlist = action.payload;
   },
   setleftbarRegioncheckboxlist: (state, action: {payload:leftbarRegioncheckboxlist,type:string}) => {
    state.leftbarRegioncheckboxlist = action.payload;
  },
  setleftbarStationcheckboxlist: (state, action: {payload:leftbarStationcheckboxlist,type:string}) => {
   state.leftbarStationcheckboxlist = action.payload;
 },
    setNetworkregions: (state, action: networkregionstype) => {
      state.networkregions = action.payload;
    },
    setRegionstations: (state, action: regionstationstype) => {
      state.regionstations = action.payload;
    },
    setStationsrtu: (state, action: stationsrtutype) => {
      state.stationsrtu = action.payload;
    },
  },
});

export const {setNetworkregions,setleftbarcheckboxlist, setRegionstations,setStationsrtu,setleftbarNetworkcheckboxlist,setleftbarRegioncheckboxlist,setleftbarStationcheckboxlist,setallLeftbar} = rtu.actions;

export default rtu.reducer;
