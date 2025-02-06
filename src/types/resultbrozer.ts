import {opticalrouteUpdateTestSetupDetailtype} from '~/types/opticalrouteType';

export type alldefaultstationsrtutype = {
    stationid: string;
    networkid: string;
    rtues: {name: string; id: string}[];
    deletertues: string[];
  };
 export type veiwerlists = {
    payload: opticalrouteUpdateTestSetupDetailtype;
    type: string;
  };
  export type resultbrosernetworkopticaltype={networkid: string; opticalrouts: {name: string; id: string}[]}[]
  export type networkselectedlisttype={
    payload: string[];
    type: string;
  }
  
  export type networkopticaltypeAction={
    payload:resultbrosernetworkopticaltype;
    type: string;
  }
  export  type alldeleteopticalroutetype={
    networkid: string; opticalrouts:string[];
  }[]
  export type alldefaultregionstationstype = {
    networkid: string;
    stations: {name: string; id: string}[];
  };
  export type defaultstationsrtutype = {
    payload: alldefaultstationsrtutype[];
    type: string;
  };
  export type alldeleteopticalroutetypeAction={
    payload:alldeleteopticalroutetype;
    type: string;
  }
  
 export type networkopticalroutetype={networkid: string; opticalrouts: {name: string; id: string}[]}
  