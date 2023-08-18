import * as T from '~/types';
import * as api from '~/constant/api';
import {regionStationListUrl} from '~/constant/api';
import {GroupType} from '~/types/GroupType';

export const excludeList = ['categoryList'];
export type RequestKeyExclude = keyof Omit<RequestListTypes, 'uploadFile'>;

type RequestKeys =
  | 'login'
  | 'refresh'
  | 'networkList'
  | 'networkDetail'
  | 'networkCreate'
  | 'networkDelete'
  | 'networkUpdate'
  | 'networkAccessList'
  | 'userList'
  | 'networkAccessUpdate'
  | 'networkUpdateAdmin'
  | 'groupList'
  | 'regionList'
  | 'regionCreate'
  | 'regionDetail'
  | 'regionUpdate'
  | 'regionAccessList'
  | 'regionAccessUpdate'
  | 'regionStationList'
  | 'regionLinkList'
  | 'regionAdminUpdate'
  | 'stationCreate'
  | 'stationDetail'
  | 'stationUpdate'
  | 'stationDelete'
  | 'networkStationList'
  | 'stationAccessList'
  | 'stationViewerUpdate'
  | 'stationAdminUpdate';
export const RequestList: Record<RequestKeys, T.ActionRequestType> = {
  login: {
    url: api.baseUrl + api.loginUrl,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  refresh: {
    url: api.baseUrl + api.refreshTokenUrl,
    method: 'post',
    headers: {'content-type': 'application/x-www-form-urlencoded'},
  },
  userList: {
    url: api.baseUrl + api.userListUrl,
    method: 'get',
    auth: true,
  },
  networkCreate: {
    url: api.baseUrl + api.networkCreateUrl,
    method: 'post',
    auth: true,
  },
  networkList: {
    url: api.baseUrl + api.networkListUrl,
    method: 'get',
    auth: true,
  },
  networkDetail: {
    url: api.baseUrl + api.networkDetailUrl,
    method: 'get',
    auth: true,
  },
  networkDelete: {
    url: api.baseUrl + api.networkDetailUrl,
    method: 'delete',
    auth: true,
  },
  networkUpdate: {
    url: api.baseUrl + api.networkDetailUrl,
    method: 'put',
    auth: true,
  },
  networkAccessList: {
    url: api.baseUrl + api.networkAccessListUrl,
    method: 'get',
    auth: true,
  },
  networkAccessUpdate: {
    url: api.baseUrl + api.networkAccessListUpdateUrl,
    method: 'post',
    auth: true,
  },
  groupList: {
    url: api.baseUrl + api.groupListUrl,
    method: 'get',
    auth: true,
  },
  regionList: {url: api.baseUrl + api.regionListUrl, method: 'get', auth: true},
  regionCreate: {
    url: api.baseUrl + api.regionCreateUrl,
    method: 'post',
    auth: true,
  },
  regionDetail: {
    url: api.baseUrl + api.regionDetailUrl,
    method: 'get',
    auth: true,
  },
  regionUpdate: {
    url: api.baseUrl + api.regionDetailUrl,
    method: 'put',
    auth: true,
  },
  regionAccessList: {
    url: api.baseUrl + api.regionAccessUrl,
    method: 'get',
    auth: true,
  },
  regionAccessUpdate: {
    url: api.baseUrl + api.regionViewerUpdateUrl,
    method: 'post',
    auth: true,
  },
  regionStationList: {
    url: api.baseUrl + regionStationListUrl,
    method: 'get',
    auth: true,
  },
  networkUpdateAdmin: {
    url: api.baseUrl + api.networkUpdateAdminUrl,
    method: 'put',
    auth: true,
  },
  regionLinkList: {
    url: api.baseUrl + api.regionLinkListUrl,
    method: 'get',
    auth: true,
  },
  regionAdminUpdate: {
    url: api.baseUrl + api.regionAdminUpdateUrl,
    method: 'put',
    auth: true,
  },
  stationCreate: {url: api.baseUrl + api.stationUrl, method: 'post', auth: true},
  stationDetail: {
    url: api.baseUrl + api.stationRUDUrl,
    method: 'post',
    auth: true,
  },
  stationUpdate: {
    url: api.baseUrl + api.stationRUDUrl,
    method: 'put',
    auth: true,
  },
  stationDelete: {
    url: api.baseUrl + api.stationRUDUrl,
    method: 'delete',
    auth: true,
  },
  networkStationList: {
    url: api.baseUrl + api.networkStationListUrl,
    method: 'get',
    auth: true,
  },
  stationAccessList: {
    url: api.baseUrl + api.stationAccessUrl,
    method: 'get',
    auth: true,
  },
  stationViewerUpdate: {
    url: api.baseUrl + api.stationViewerUpdateUrl,
    method: 'post',
    auth: true,
  },
  stationAdminUpdate: {
    url: api.baseUrl + api.stationAdminUpdateUrl,
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
  userList: undefined;
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
  regionLinkList: {params: {region_id: string}};
  regionAdminUpdate: {params: {region_id: string}; data: {user_id: string}};
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
};

export type ResponseListType = {
  login: T.LoginResponseType;
  refresh: T.LoginResponseType;
  userList: T.UserListType[];
  networkCreate: T.NetworkType & {network_id: string};
  networkList: T.NetworkType[];
  networkDetail: T.NetworkDetailType;
  networkDelete: {count: number};
  networkUpdate: T.NetworkType;
  networkAccessList: {users: T.AccessListType[]};
  networkAccessUpdate: {count: number};
  groupList: GroupType[];
  regionList: T.RegionListType[];
  regionCreate: T.RegionListType & {region_id: string};
  regionDetail: T.RegionType;
  regionUpdate: T.RegionType;
  regionAccessList: {users: T.AccessListType[]};
  regionAccessUpdate: {count: number};
  regionStationList: T.StationListType[];
  networkUpdateAdmin: string;
  regionLinkList: T.RegionLinkType[];
  regionAdminUpdate: string;
  stationCreate: T.StationCreateType & {station_id: string};
  stationDetail: T.StationType;
  stationUpdate: T.StationListType;
  stationDelete: {count: number};
  networkStationList: T.StationListType[];
  stationAccessList: T.AccessListType;
  stationViewerUpdate: {count: number};
  stationAdminUpdate: string;
};
