import {opticalrouteUpdateTestSetupDetailtype} from '~/types/opticalrouteType'


export type veiwerlists = {
    payload: opticalrouteUpdateTestSetupDetailtype;
    type: string;
  };
  export type networkopticaltype={networkid: string; opticalrouts: {name: string; id: string}[]}[]
  export type networkselectedlisttype={
    payload: string[];
    type: string;
  }
  
  export type networkopticaltypeAction={
    payload:networkopticaltype;
    type: string;
  }
  export  type alldeleteopticalroutetype={
    networkid: string; opticalrouts:string[];
  }[]
  
  
  export type alldeleteopticalroutetypeAction={
    payload:alldeleteopticalroutetype;
    type: string;
  }
  