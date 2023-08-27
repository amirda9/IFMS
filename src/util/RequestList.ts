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
  | 'passwordReset'
  | 'networkList'
  | 'networkDetail'
  | 'networkCreate'
  | 'networkDelete'
  | 'networkUpdate'
  | 'networkAccessList'
  | 'userList'
  | 'userDetail'
  | 'userDetailUpdate'
  | 'userGroupsList'
  | 'networkAccessUpdate'
  | 'networkUpdateAdmin'
  | 'groupList'
  | 'groupDetail'
  | 'updateGroup'
  | 'allRegions'
  | 'regionList'
  | 'regionCreate'
  | 'regionDetail'
  | 'regionUpdate'
  | 'regionAccessList'
  | 'regionAccessUpdate'
  | 'regionStationList'
  | 'allLinks'
  | 'regionLinkList'
  | 'regionAdminUpdate'
  | 'allStations'
  | 'stationCreate'
  | 'stationDetail'
  | 'stationUpdate'
  | 'stationDelete'
  | 'networkStationList'
  | 'stationAccessList'
  | 'stationViewerUpdate'
  | 'stationAdminUpdate'
  | 'userNetworkAccesses'
  | 'userRegionAccesses'
  | 'userStationAccesses'
  | 'userLinkAccesses'
  | 'updateUserNetworkAccesses'
  | 'updateUserRegionAccesses'
  | 'updateUserStationAccesses'
  | 'updateUserLinkAccesses';

export const RequestList: Record<RequestKeys, T.ActionRequestType> = {
  login: {
    url: api.BASE_URL + api.URLS.auth.users.login,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  refresh: {
    url: api.BASE_URL + api.URLS.auth.users.refreshToken,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
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
  updateGroup: {
    url: api.BASE_URL + api.URLS.auth.groups.single,
    method: 'put',
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
  regionStationList: {
    url: api.BASE_URL + api.URLS.otdr.station.listInRegion,
    method: 'get',
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
  stationCreate: {
    url: api.BASE_URL + api.URLS.otdr.station.all,
    method: 'post',
    auth: true,
  },
  stationDetail: {
    url: api.BASE_URL + api.URLS.otdr.station.single,
    method: 'post',
    auth: true,
  },
  stationUpdate: {
    url: api.BASE_URL + api.URLS.otdr.station.single,
    method: 'put',
    auth: true,
  },
  stationDelete: {
    url: api.BASE_URL + api.URLS.otdr.station.single,
    method: 'delete',
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
  passwordReset: {
    params: {user_id: string};
    data: {
      new_password: string;
      confirm_new_password: string;
    };
  };
  userList: undefined;
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
  networkUpdate: {params: {networkId: string}; data: {description: string}};
  networkAccessList: {params: {network_id: string}};
  networkAccessUpdate: {
    params: {network_id: string};
    data: {users: string[]};
  };
  groupList: undefined;
  groupDetail: {params: {group_id: string}};
  updateGroup: {
    params: {group_id: string};
    data: {name: string; users: string[]};
  };
  allRegions: undefined;
  regionList: {params: {network_id: string}};
  regionCreate: {
    params: {network_id: string};
    data: {name: string; description: string};
  };
  regionDetail: {params: {region_id: string}};
  regionUpdate: {params: {region_id: string}; data: {description: string}};
  regionAccessList: {params: {region_id: string}};
  regionAccessUpdate: {
    params: {region_id: string};
    data: {users: string[]};
  };
  regionStationList: {params: {region_id: string}};
  networkUpdateAdmin: {data: {user_id: string}; params: {network_id: string}};
  allLinks: undefined;
  regionLinkList: {params: {region_id: string}};
  regionAdminUpdate: {params: {region_id: string}; data: {user_id: string}};
  allStations: undefined;
  stationCreate: {data: T.StationCreateType};
  stationDetail: {params: {station_id: string}};
  stationUpdate: {
    params: {station_id: string};
    data: {
      model: string;
      longitude: number;
      latitude: number;
      description: string;
    };
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
};

export type ResponseListType = {
  login: T.LoginResponseType;
  refresh: T.LoginResponseType;
  passwordReset: string;
  userList: T.UserListType[];
  userDetail: T.UserDetailType;
  userDetailUpdate: {id: string; username: string; role: string; email: string};
  userGroupsList: {id: string; name: string}[];
  networkCreate: T.NetworkType & {network_id: string};
  networkList: T.NetworkType[];
  networkDetail: T.NetworkDetailType;
  networkDelete: {count: number};
  networkUpdate: T.NetworkType;
  networkAccessList: {users: T.AccessListType[]};
  networkAccessUpdate: {count: number};
  groupList: T.GroupType[];
  groupDetail: T.GroupDetailType;
  updateGroup: T.GroupType;
  allRegions: T.RegionListType[];
  regionList: T.RegionListType[];
  regionCreate: T.RegionListType & {region_id: string};
  regionDetail: T.RegionType;
  regionUpdate: T.RegionType;
  regionAccessList: {users: T.AccessListType[]};
  regionAccessUpdate: {count: number};
  regionStationList: T.StationListType[];
  networkUpdateAdmin: string;
  allLinks: T.LinkType[];
  regionLinkList: T.LinkType[];
  regionAdminUpdate: string;
  allStations: T.StationListType[];
  stationCreate: T.StationCreateType & {station_id: string};
  stationDetail: T.StationType;
  stationUpdate: T.StationListType;
  stationDelete: {count: number};
  networkStationList: T.StationListType[];
  stationAccessList: T.AccessListType;
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
};
