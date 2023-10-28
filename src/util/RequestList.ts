import * as T from '~/types';
import * as api from '~/constant/api';

export const excludeList = ['categoryList'];
export type RequestKeyExclude = keyof Omit<RequestListTypes, 'uploadFile'>;

/**
 * TODO: Find a way to better organize the names;
 * As the number of APIs grow, it will get harder to keep track of available API definitions
 */

type RequestKeys =
  | 'login'
  | 'refresh'
  | 'verifyToken'
  | 'passwordReset'
  | 'networkList'
  | 'networkDetail'
  | 'rtuDetail'
  | 'rtuPorts'
  | 'networkCreate'
  | 'networkDelete'
  | 'stationDelete'
  | 'networkUpdate'
  | 'networkAccessList'
  | 'userList'
  | 'userRegister'
  | 'userDetail'
  | 'userDetailUpdate'
  | 'deleteUserSession'
  | 'userGroupsList'
  | 'networkAccessUpdate'
  | 'deleteShapefile'
  | 'networkUpdateAdmin'
  | 'linkupdatecables'
  | 'groupList'
  | 'groupDetail'
  | 'createGroup'
  | 'updateGroup'
  | 'deleteGroup'
  | 'allRegions'
  | 'regionList'
  | 'regionCreate'
  | 'rtuCreate'
  | 'rtuUpdate'
  | 'linkCreate'
  | 'linkDetail'
  | 'mapDetail'
  | 'linkUpdate'
  | 'regionDetail'
  | 'regionUpdate'
  | 'regionAccessList'
  | 'regionAccessUpdate'
  | 'regionStationList'
  | 'updateregionStationList'
  | 'removeregionStationList'
  | 'addregionStationList'
  | 'updateregionLinkList'
  | 'addregionLinkList'
  | 'removeregionLinkList'
  | 'allLinks'
  | 'regionLinkList'
  | 'regionAdminUpdate'
  | 'allStations'
  | 'networkstations'
  | 'stationCreate'
  | 'stationDetail'
  | 'stationrtuList'
  | 'stationUpdate'
  | 'stationAccessUpdate'
  | 'linkAccessUpdate'
  | 'networkStationList'
  | 'stationAccessList'
  | 'linkAccessList'
  | 'linkAddadmin'
  | 'stationAddadmin'
  | 'stationViewerUpdate'
  | 'stationAdminUpdate'
  | 'userNetworkAccesses'
  | 'userRegionAccesses'
  | 'userStationAccesses'
  | 'userLinkAccesses'
  | 'updateUserNetworkAccesses'
  | 'updateUserRegionAccesses'
  | 'updateUserStationAccesses'
  | 'updateUserLinkAccesses'
  | 'regionDelete'
  | 'linkDelete'
  | 'opticalrouteCreate'
  ;

export const RequestList: Record<RequestKeys, T.ActionRequestType> = {
  login: {
    url: api.BASE_URL + api.URLS.auth.users.login,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  refresh: {
    url: api.BASE_URL + api.URLS.auth.users.token.refreshToken,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  verifyToken: {
    url: api.BASE_URL + api.URLS.auth.users.token.verifyToken,
    method: 'get',
    auth: true,
  },
  passwordReset: {
    url: api.BASE_URL + api.URLS.auth.users.changePassword,
    method: 'post',
    auth: true,
  },
  userList: {
    url: api.BASE_URL + api.URLS.auth.users.all,
    method: 'get',
    auth: true,
  },
  userRegister: {
    url: api.BASE_URL + api.URLS.auth.users.all,
    method: 'post',
    auth: true,
  },
  userDetail: {
    url: api.BASE_URL + api.URLS.auth.users.single,
    method: 'get',
    auth: true,
  },
  userDetailUpdate: {
    url: api.BASE_URL + api.URLS.auth.users.single,
    method: 'put',
    auth: true,
  },
  deleteUserSession: {
    url: api.BASE_URL + api.URLS.auth.users.singleSession,
    method: 'delete',
    auth: true,
  },
  userGroupsList: {
    url: api.BASE_URL + api.URLS.auth.users.groups,
    method: 'get',
    auth: true,
  },
  networkCreate: {
    url: api.BASE_URL + api.URLS.otdr.network.all,
    method: 'post',
    auth: true,
  },
  networkList: {
    url: api.BASE_URL + api.URLS.otdr.network.all,
    method: 'get',
    auth: true,
  },
  networkDetail: {
    url: api.BASE_URL + api.URLS.otdr.network.single,
    method: 'get',
    auth: true,
  },

  networkDelete: {
    url: api.BASE_URL + api.URLS.otdr.network.single,
    method: 'delete',
    auth: true,
  },
  networkUpdate: {
    url: api.BASE_URL + api.URLS.otdr.network.single,
    method: 'put',
    auth: true,
  },

  networkAccessList: {
    url: api.BASE_URL + api.URLS.otdr.network.allAccess,
    method: 'get',
    auth: true,
  },
  networkAccessUpdate: {
    url: api.BASE_URL + api.URLS.otdr.network.viewersAccess,
    method: 'post',
    auth: true,
  },
  deleteShapefile: {
    url: api.BASE_URL + api.URLS.otdr.network.deleteShapefile,
    method: 'delete',
    auth: true,
  },
  groupList: {
    url: api.BASE_URL + api.URLS.auth.groups.all,
    method: 'get',
    auth: true,
  },
  groupDetail: {
    url: api.BASE_URL + api.URLS.auth.groups.single,
    method: 'get',
    auth: true,
  },
  createGroup: {
    url: api.BASE_URL + api.URLS.auth.groups.all,
    method: 'post',
    auth: true,
  },
  updateGroup: {
    url: api.BASE_URL + api.URLS.auth.groups.single,
    method: 'put',
    auth: true,
  },
  deleteGroup: {
    url: api.BASE_URL + api.URLS.auth.groups.single,
    method: 'delete',
    auth: true,
  },
  allRegions: {
    url: api.BASE_URL + api.URLS.otdr.region.all,
    method: 'get',
    auth: true,
  },
  regionList: {
    url: api.BASE_URL + api.URLS.otdr.region.listInNetwork,
    method: 'get',
    auth: true,
  },
  regionCreate: {
    url: api.BASE_URL + api.URLS.otdr.region.create,
    method: 'post',
    auth: true,
  },
  regionDetail: {
    url: api.BASE_URL + api.URLS.otdr.region.single,
    method: 'get',
    auth: true,
  },
  regionUpdate: {
    url: api.BASE_URL + api.URLS.otdr.region.single,
    method: 'put',
    auth: true,
  },
  regionAccessList: {
    url: api.BASE_URL + api.URLS.otdr.region.allAccess,
    method: 'get',
    auth: true,
  },
  regionAccessUpdate: {
    url: api.BASE_URL + api.URLS.otdr.region.viewersAccess,
    method: 'post',
    auth: true,
  },
  stationDelete: {
    url: api.BASE_URL + api.URLS.otdr.station.single,
    method: 'delete',
    auth: true,
  },
  stationAccessUpdate: {
    url: api.BASE_URL + api.URLS.otdr.station.viewersAccess,
    method: 'post',
    auth: true,
  },
  regionStationList: {
    url: api.BASE_URL + api.URLS.otdr.station.listInRegion,
    method: 'get',
    auth: true,
  },
  updateregionStationList: {
    url: api.BASE_URL + api.URLS.otdr.region.updateregionStationList,
    method: 'post',
    auth: true,
  },
  addregionStationList: {
    url: api.BASE_URL + api.URLS.otdr.region.addregionStationList,
    method: 'post',
    auth: true,
  },
  removeregionStationList: {
    url: api.BASE_URL + api.URLS.otdr.region.removeregionStationList,
    method: 'post',
    auth: true,
  },
  updateregionLinkList: {
    url: api.BASE_URL + api.URLS.otdr.region.updateregionLinkList,
    method: 'post',
    auth: true,
  },
  addregionLinkList: {
    url: api.BASE_URL + api.URLS.otdr.region.addregionLinkList,
    method: 'post',
    auth: true,
  },
  removeregionLinkList: {
    url: api.BASE_URL + api.URLS.otdr.region.removeregionLinkList,
    method: 'post',
    auth: true,
  },
  networkUpdateAdmin: {
    url: api.BASE_URL + api.URLS.otdr.network.adminAccess,
    method: 'put',
    auth: true,
  },
  allLinks: {
    url: api.BASE_URL + api.URLS.otdr.link.all,
    method: 'get',
    auth: true,
  },
  linkDetail: {
    url: api.BASE_URL + api.URLS.otdr.link.single,
    method: 'get',
    auth: true,
  },
  linkupdatecables: {
    url: api.BASE_URL + api.URLS.otdr.link.updatecableandduct,
    method: 'put',
    auth: true,
  },
  linkAccessUpdate: {
    url: api.BASE_URL + api.URLS.otdr.link.viewersAccess,
    method: 'post',
    auth: true,
  },
  linkUpdate: {
    url: api.BASE_URL + api.URLS.otdr.link.single,
    method: 'put',
    auth: true,
  },
  linkAccessList: {
    url: api.BASE_URL + api.URLS.otdr.link.allAccess,
    method: 'get',
    auth: true,
  },
  linkAddadmin: {
    url: api.BASE_URL + api.URLS.otdr.link.Addadmin,
    method: 'put',
    auth: true,
  },
  regionLinkList: {
    url: api.BASE_URL + api.URLS.otdr.link.listInRegion,
    method: 'get',
    auth: true,
  },
  regionAdminUpdate: {
    url: api.BASE_URL + api.URLS.otdr.region.adminAccess,
    method: 'put',
    auth: true,
  },
  allStations: {
    url: api.BASE_URL + api.URLS.otdr.station.all,
    method: 'get',
    auth: true,
  },
  networkstations: {
    url: api.BASE_URL + api.URLS.otdr.station.networkstations,
    method: 'get',
    auth: true,
  },
  stationCreate: {
    url: api.BASE_URL + api.URLS.otdr.station.all,
    method: 'post',
    auth: true,
  },
  stationDetail: {
    url: api.BASE_URL + api.URLS.otdr.station.single,
    method: 'get',
    auth: true,
  },
  stationrtuList: {
    url: api.BASE_URL + api.URLS.otdr.station.stationrtuList,
    method: 'get',
    auth: true,
  },
  stationAddadmin: {
    url: api.BASE_URL + api.URLS.otdr.station.Addadmin,
    method: 'put',
    auth: true,
  },
  stationUpdate: {
    url: api.BASE_URL + api.URLS.otdr.station.single,
    method: 'put',
    auth: true,
  },
  mapDetail: {
    url: api.BASE_URL + api.URLS.otdr.map.single,
    method: 'get',
    auth: true,
  },
  networkStationList: {
    url: api.BASE_URL + api.URLS.otdr.station.listInNetwork,
    method: 'get',
    auth: true,
  },
  stationAccessList: {
    url: api.BASE_URL + api.URLS.otdr.station.allAccess,
    method: 'get',
    auth: true,
  },
  stationViewerUpdate: {
    url: api.BASE_URL + api.URLS.otdr.station.viewersAccess,
    method: 'post',
    auth: true,
  },
  stationAdminUpdate: {
    url: api.BASE_URL + api.URLS.otdr.station.adminAccess,
    method: 'put',
    auth: true,
  },
  userNetworkAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.networks,
    method: 'get',
    auth: true,
  },
  userRegionAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.regions,
    method: 'get',
    auth: true,
  },
  userStationAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.stations,
    method: 'get',
    auth: true,
  },
  userLinkAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.links,
    method: 'get',
    auth: true,
  },
  updateUserNetworkAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.networks,
    method: 'put',
    auth: true,
  },
  updateUserRegionAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.regions,
    method: 'put',
    auth: true,
  },
  updateUserStationAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.stations,
    method: 'put',
    auth: true,
  },
  updateUserLinkAccesses: {
    url: api.BASE_URL + api.URLS.auth.users.accesses.links,
    method: 'put',
    auth: true,
  },
  regionDelete: {
    url: api.BASE_URL + api.URLS.otdr.region.single,
    method: 'delete',
    auth: true,
  },
  linkDelete: {
    url: api.BASE_URL + api.URLS.otdr.link.single,
    method: 'delete',
    auth: true,
  },
  linkCreate: {
    url: api.BASE_URL + api.URLS.otdr.link.create,
    method: 'post',
    auth: true,
  },

  rtuCreate: {
    url: api.BASE_URL + api.URLS.otdr.rtu.create,
    method: 'post',
    auth: true,
  },
  rtuDetail: {
    url: api.BASE_URL + api.URLS.otdr.rtu.single,
    method: 'get',
    auth: true,
  },
  rtuUpdate: {
    url: api.BASE_URL + api.URLS.otdr.rtu.update,
    method: 'put',
    auth: true,
  },
  rtuPorts: {
    url: api.BASE_URL + api.URLS.otdr.rtu.ports,
    method: 'get',
    auth: true,
  },
  opticalrouteCreate: {
    url: api.BASE_URL + api.URLS.otdr.opticalroute.create,
    method: 'post',
    auth: true,
  },
};

export type RequestListTypes = {
  login: {
    data: {
      username: string;
      password: string;
    };
  };
  refresh: {
    data: {refresh_token: string};
  };
  verifyToken: undefined;
  passwordReset: {
    params: {user_id: string};
    data: {
      new_password: string;
      confirm_new_password: string;
    };
  };
  userList: undefined;
  userRegister: {
    data: {
      username: string;
      password: string;
      confirm_password: string;
      email: string | null;
      name: string | null;
      telephone: string | null;
      mobile: string | null;
      address: string | null;
      comment: string | null;
      station_id: string | null;
      region_id: string | null;
    };
  };
  userDetail: {
    params: {
      user_id: string;
    };
  };
  userDetailUpdate: {
    params: {
      user_id: string;
    };
    data: T.UserDetailFormType;
  };
  deleteUserSession: {
    params: {session_id: string};
  };
  userGroupsList: {
    params: {
      user_id: string;
    };
  };
  networkCreate: {
    data: {
      name: string;
      description: string;
    };
  };
  networkList: undefined;
  networkDetail: {params: {networkId: string}};
  networkDelete: {params: {networkId: string}};
  networkUpdate: {
    params: {networkId: string};
    data: {name: string; description: string};
  };
  networkAccessList: {params: {network_id: string}};
  networkAccessUpdate: {
    params: {network_id: string};
    data: {users: string[]};
  };
  deleteShapefile: {
    params: {shapefile_id: string};
  };
  groupList: undefined;
  groupDetail: {params: {group_id: string}};
  createGroup: {data: {name: string; users: string[]}};
  updateGroup: {
    params: {group_id: string};
    data: {name: string; users: string[]};
  };
  deleteGroup: {
    params: {group_id: string};
  };
  allRegions: undefined;
  regionList: {params: {network_id: string}};
  regionCreate: {
    params: {network_id: string};
    data: {name: string; description: string};
  };
  // linkList: undefined;
  linkCreate: {
    data: {
      name: string;
      network_id: string;
      source_id: string;
      destination_id: string;
      link_points: {
        latitude: number;
        longitude: number;
      }[];
      // region_id: string;
      description: string;
      type: string;
    };
  };
  linkAccessUpdate: {
    params: {link_id: string};
    data: {users: string[]};
  };
  linkAccessList: {
    params: {link_id: string};
  };
  linkAddadmin: {
    params: {link_id: string};
    data: {
      user_id: string;
    };
  };
  linkDelete: {params: {link_id: string}};
  linkDetail: {params: {link_id: string}};

  linkUpdate: {
    params: {link_id: string};
    data: {
      name: string;
      description: string;
      link_points: {
        latitude: number;
        longitude: number;
      }[];

      source_id: string;
      destination_id: string;
      type: string;
    };
  };
  linkupdatecables: {
    data: {
      cables:
        | {
            id: number;
            cableId: string;
            number_of_cores: number;
            segments: [
              {
                id: number;
                start: number;
                length: number;
                offset: number;
                loss: number;
                fiber_type: string;
              },
            ];
          }[]
        | [];
      ducts:
        | {
            id: string;
            mini_ducts: [
              {
                id: string;
                number_of_fibers: number;
              },
            ];
            segments: [
              {
                start: number;
                length: number;
                offset: number;
                loss: number;
                fiber_type: string;
              },
            ];
          }[]
        | [];
    };
    params: {link_id: string};
  };

  rtuCreate: {
    data: {
      name: string,
      model: string,
      station_id: string,
      contact_person_id: string,
      otdr_ip: string,
      otdr_port: number,
      switch_ip: string,
      switch_port: number,
      subnet_mask: string,
      default_gateway: string
    };
  };
  rtuUpdate: {
    params: {rtu_id: string};
    data: { 
      name: string,
      model: string,
      station_id: string,
      contact_person_id: string,
      otdr_ip: string,
      otdr_port: number,
      switch_ip: string,
      switch_port: number,
      subnet_mask: string,
      default_gateway: string
  };
  };

  opticalrouteCreate: {
    data: {
      name: string,
      comment: string,
      test_ready: boolean,
      type:string,
      avg_hellix_factor: number,
      network_id: string
    };
  };


  rtuDetail: {params: {rtu_Id: string}};
  rtuPorts: {params: {rtu_id: string}};
  regionDetail: {params: {region_id: string}};
  regionUpdate: {params: {region_id: string}; data: {description: string}};
  regionAccessList: {params: {region_id: string}};
  regionAccessUpdate: {
    params: {region_id: string};
    data: {users: string[]};
  };
  regionStationList: {params: {region_id: string}};
  updateregionStationList: {
    params: {region_id: string};
    data: {
      stations_id: string[];
    };
  };
  addregionStationList: {
    params: {region_id: string};
    data: {
      stations_id: string[];
    };
  };

 removeregionStationList: {
    params: {region_id: string};
    data: {
      stations_id: string[];
    };
  };
  updateregionLinkList: {
    params: {region_id: string};
    data: {
      links_id: string[];
    };
  };
  addregionLinkList: {
    params: {region_id: string};
    data: {
      links_id: string[];
    };
  };
  removeregionLinkList: {
    params: {region_id: string};
    data: {
      links_id: string[];
    };
  };
  mapDetail: {params: {network_id: string}};

  networkUpdateAdmin: {data: {user_id: string}; params: {network_id: string}};
  allLinks: undefined;
  regionLinkList: {params: {region_id: string}};
  regionAdminUpdate: {params: {region_id: string}; data: {user_id: string}};
  allStations: undefined;
  networkstations: {params: {network_id: string}};
  stationCreate: {data: T.StationCreateType};
  stationDetail: {params: {station_id: string}};
  stationrtuList: {params: {station_id: string}};
  stationUpdate: {
    params: {station_id: string};
    data: {
      name: string;
      model: string;
      longitude: number;
      latitude: number;
      description: string;
    };
  };
  stationAccessUpdate: {
    params: {station_id: string};
    data: {users: string[]};
  };
  stationDelete: {
    params: {station_id: string};
  };
  networkStationList: {
    params: {network_id: string};
  };
  stationAccessList: {
    params: {station_id: string};
  };
  stationViewerUpdate: {
    params: {station_id: string};
    data: {users: string};
  };
  stationAddadmin: {
    params: {station_id: string};
    data: {
      user_id: string;
    };
  };
  stationAdminUpdate: {
    params: {station_id: string};
    data: {user_id: string};
  };
  userNetworkAccesses: {
    params: {user_id: string};
    queryString: {access_type?: 'ADMIN' | 'VIEWER'};
  };
  userRegionAccesses: {
    params: {
      user_id: string;
    };
    queryString: {
      network_id: string;
      access_type?: 'ADMIN' | 'VIEWER';
    };
  };
  userStationAccesses: {
    params: {
      user_id: string;
    };
    queryString: {
      network_id: string;
      access_type?: 'ADMIN' | 'VIEWER';
    };
  };
  userLinkAccesses: {
    params: {
      user_id: string;
    };
    queryString: {
      network_id: string;
      access_type?: 'ADMIN' | 'VIEWER';
    };
  };
  updateUserNetworkAccesses: {
    params: {user_id: string};
    queryString: {access_type?: 'ADMIN' | 'VIEWER'};
    data: {
      ids: string[];
    };
  };
  updateUserRegionAccesses: {
    params: {
      user_id: string;
    };
    queryString: {
      network_id: string;
      access_type?: 'ADMIN' | 'VIEWER';
    };
    data: {
      ids: string[];
    };
  };
  updateUserStationAccesses: {
    params: {
      user_id: string;
    };
    queryString: {
      network_id: string;
      access_type?: 'ADMIN' | 'VIEWER';
    };
    data: {
      ids: string[];
    };
  };
  updateUserLinkAccesses: {
    params: {
      user_id: string;
    };
    queryString: {
      network_id: string;
      access_type?: 'ADMIN' | 'VIEWER';
    };
    data: {
      ids: string[];
    };
  };
  regionDelete: {params: {region_id: string}};
};

export type ResponseListType = {
  login: T.LoginResponseType;
  refresh: T.LoginResponseType;
  verifyToken: T.UserDetailType & {is_admin: boolean};
  passwordReset: string;
  userList: T.UserListType[];
  userRegister: T.UserDetailType[];
  userDetail: T.UserDetailType;
  userDetailUpdate: {id: string; username: string; role: string; email: string};
  deleteUserSession: string | null;
  userGroupsList: {id: string; name: string}[];
  networkCreate: T.NetworkType & {network_id: string};
  networkList: T.NetworkType[];
  networkDetail: T.NetworkDetailType;
  networkDelete: {count: number};
  networkUpdate: T.NetworkType;
  networkAccessList: {users: T.AccessListType[]};
  networkAccessUpdate: {count: number};
  deleteShapefile: string;
  groupList: T.GroupType[];
  groupDetail: T.GroupDetailType;
  createGroup: string | null;
  updateGroup: T.GroupType;
  deleteGroup: string | null;
  allRegions: T.RegionListType[];
  regionList: T.RegionListType[];
  regionCreate: T.RegionListType & {region_id: string};
  linkCreate: T.LinkCreateType;
  regionDetail: T.RegionType;
  linkDetail: T.LinksType;
  linkUpdate: T.LinksType;
  linkupdatecables: string;
  linkAccessList: {users: T.AccessListType[]};
  linkAddadmin: string;
  linkAccessUpdate: {count: number};
  rtuCreate: T.RtucreateType;
  rtuDetail: T.rtudetailType;
  rtuPorts: T.rtuportType;
  opticalrouteCreate: T.opticalroutecreateType;
  rtuUpdate:T.rtuupdateType;
  mapDetail: T.MapType;
  regionUpdate: T.RegionType;
  regionAccessList: {users: T.AccessListType[]};
  regionAccessUpdate: {count: number};
  regionStationList: T.regionstationlist[];
  updateregionStationList: T.regionstationlist[];
 addregionStationList: T.regionstationlist[];
  removeregionStationList: T.regionstationlist[];
  updateregionLinkList: T.regionlinklist[];
  addregionLinkList: T.regionlinklist[];
  removeregionLinkList: T.regionlinklist[];
  networkUpdateAdmin: string;
  allLinks: T.allLinksType[];
  regionLinkList: T.regiolinklist[];
  regionAdminUpdate: string;
  allStations: T.StationListType[];
  networkstations: T.networkstationslistType[];
  stationCreate: T.StationCreateType & {station_id: string};
  stationAddadmin: string;
  stationDetail: T.StationType;
  stationUpdate: T.StationListType;
  stationrtuList:T.stationrtulisttype[]
  stationAccessUpdate: {count: number};
  stationDelete: {count: number};
  networkStationList: T.StationListType[];
  stationAccessList: {users: T.AccessListType[]};
  stationViewerUpdate: {count: number};
  stationAdminUpdate: string;
  userNetworkAccesses: T.NetworkAccessType[];
  userRegionAccesses: T.RegionAccessType[];
  userStationAccesses: T.StationAccessType[];
  userLinkAccesses: T.LinkAccessType[];
  updateUserNetworkAccesses: string | null;
  updateUserRegionAccesses: string | null;
  updateUserStationAccesses: string | null;
  updateUserLinkAccesses: string | null;
  regionDelete: {count: number};
  linkDelete: {count: number};
};
