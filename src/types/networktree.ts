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
  
  export type deletegroupstationtype = {
    payload: {networkid: string; regionid: string; stationsid: string[]};
    type: string;
  };
  
  export type deletedefaultgroupstationtype = {
    payload: {networkid: string; stationsid: string[]};
    type: string;
  };
  
  export  type deletegrouplinktype = {
    payload: {regionid: string; linksid: string[]};
    type: string;
  };
  
  export  type deletedefaultgrouplinktype = {
    payload: {networkid: string; linksid: string[]};
    type: string;
  };
  
  export  type selectedstationtype = {
    networkid: string;
    regionid: string;
    stationsID: string[];
  };
  
  export type selecteddefaultstationtype = {
    networkid: string;
    stationsID: string[];
  };
  
  export  type selectedlinktype = {
    networkid: string;
    regionid: string;
    linkID: string[];
  };
  
  export type selecteddefaultlinktype = {
    networkid: string;
    linkID: string[];
  };
  
  export  type createregiontype = {
    payload: {networkid: string; regionid: string; regionname: string};
    type: string;
  };
  
  export type changeRegion = {
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
  
  export type leftbarStationcheckboxlist = {
    length: number;
    stationid: string;
    rtues: string[];
  }[];
  export  type createStationtype = {
    payload: {
      networkid: string;
      regionid: string;
      stationid: string;
      stationname: string;
    };
    type: string;
  };
  
  export type updateStationnametype = {
    payload: {
      newregionid: string;
      networkid: string;
      regionid: string;
      stationid: string;
      stationname: string;
    };
    type: string;
  };
  
  export type updatedefaultStationtype = {
    payload: {
      networkid: string;
      regionid: string | null;
      stationid: string;
      stationname: string;
    };
    type: string;
  };
  
  export  type updateStationtype = {
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
  
  export type createLinktype = {
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
  
  export type networklisttype = {
    payload: {id: string; name: string}[];
    type: string;
  };
  
  export type createnetworkType = {
    payload: {id: string; name: string};
    type: string;
  };