import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType';
import {object, string} from 'yup';
import {deepcopy} from '~/util';
import networkslice from './networkslice';
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
    links: {name: string; id: string}[];
    // ,source:string,destination:string,sourceregionid:string,destinationregionid:string
  }[];
  type: string;
};
export type defaultregionlinkstype = {
  payload: {networkid: string; links: {name: string; id: string}[]};
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
  payload: {regionid: string; stationsid: string[]};
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
  links: {name: string; id: string}[];
  // ,source:string,destination:string,sourceregionid:string,destinationregionid:string
};

export type alldefaultregionlinkstype = {
  networkid: string;
  links: {name: string; id: string}[];
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

type createLinktype = {
  payload: {
    networkid: string;
    regionid: string;
    linkid: string;
    linkname: string;
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
};
const initialState: initialStatetype = {
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
      const defaultregionStationsCopy = deepcopy(state.defaultregionstations);
      const finddataindex = state.defaultregionstations.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (finddataindex > -1) {
        defaultregionStationsCopy[finddataindex].stations =
          action.payload.stations;
      } else {
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
        data => data.networkid == action.payload.networkid,
      );
      if (finddataindex > -1) {
        defaultregionLinksCopy[finddataindex].links = action.payload.links;
      } else {
        defaultregionLinksCopy.push(action.payload);
      }

      state.defaultregionLinks = defaultregionLinksCopy;
    },

    createdefaultRegionLinks: (state, action: {type:string,payload:{networkid: string;
      links: {
          name: string;
          id: string;
      }}}) => {
      const defaultregionLinksCopy = deepcopy(state.defaultregionLinks);
      const finddataindex = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (finddataindex > -1) {
        defaultregionLinksCopy[finddataindex].links.push(action.payload.links)
      } else {
        defaultregionLinksCopy.push({networkid:action.payload.networkid,links:[{id:action.payload.links.id,name:action.payload.links.name}]});
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
      console.log('🎫', fintnetwork);
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
     createdefaultStation: (state, action: {payload:{
      networkid: string;
      stationid: string;
      stationname: string;
  },type:string}) => {
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
        });
      } else {
        regionLinkcopy.push({
          networkid: action.payload.networkid,
          regionid: action.payload.regionid,
          links: [{id: action.payload.linkid, name: action.payload.linkname}],
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
          regionid: string;
          linkid: string;
          linkname: string;
        };
      },
    ) => {
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
     //  -----------------------------
     updatedefaltlinkname: (
      state,
      action: {
        type: string;
        payload: {
          networkid: string;
          linkid: string;
          linkname: string;
        };
      },
    ) => {
      let defaultregionLinksCopy = deepcopy(state.defaultregionLinks);
      console.log("defaultregionLinksCopy",defaultregionLinksCopy);
      
      const findwithregionindex = state.defaultregionLinks.findIndex(
        data => data.networkid == action.payload.networkid,
      );

      console.log("findwithregionindex",findwithregionindex);
      
      const findlinkid = defaultregionLinksCopy[findwithregionindex].links.findIndex(
        (data: {id: string; name: string}) => data.id == action.payload.linkid,
      );
      console.log("findlinkid",findlinkid);
      defaultregionLinksCopy[findwithregionindex].links[findlinkid].name =
        action.payload.linkname;
      state.defaultregionLinks = defaultregionLinksCopy;
    },
    //  ----------------------------
    updateStationName: (state, action: createStationtype) => {
      let regionStationsCopy = deepcopy(state.regionstations);
      const findwithregionindex = state.regionstations.findIndex(
        data => data.regionid == action.payload.regionid,
      );
      const findstationid = regionStationsCopy[
        findwithregionindex
      ].stations.findIndex(
        (data: {id: string; name: string}) =>
          data.id == action.payload.stationid,
      );
      regionStationsCopy[findwithregionindex].stations[findstationid].name =
        action.payload.stationname;
      state.regionstations = regionStationsCopy;
    },
    //---------------------------------
    updateregionname: (state, action: createregiontype) => {
      const networkregionsCopy = deepcopy(state.networkregions);
      const fintbynetworkid = state.networkregions.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      const findregionindex = state.networkregions[
        fintbynetworkid
      ].regions.findIndex(data => data.id == action.payload.regionid);
      networkregionsCopy[fintbynetworkid].regions[findregionindex].name =
        action.payload.regionname;
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
      state.regionstations = regionstationsCopy;
      state.selectedstations = newselectedstations;
    },
    //---------------------------------------------
    deletedefaultgroupstation: (
      state,
      action: deletedefaultgroupstationtype,
    ) => {
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
      const newregionlinks = state.regionLinks.filter(
        data => data.regionid != action.payload.regionid,
      );
      const newregionstations = state.regionstations.filter(
        data => data.regionid != action.payload.regionid,
      );
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
  createdefaultStation
} = networktreeslice.actions;

export default networktreeslice.reducer;
