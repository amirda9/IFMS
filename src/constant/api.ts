export const BASE_URL = 'http://37.32.27.143:8080/api';

export const URLS = {
  auth: {
    users: {
      all: '/auth/users',
      single: '/auth/users/{user_id}',
      login: '/auth/users/login',
      changePassword: '/auth/users/{user_id}/change_password',
      groups: '/auth/users/{user_id}/groups',
      token: {
        verifyToken: '/auth/users/token/verify_token',
        refreshToken: '/auth/users/token/refresh_token',
      },
      accesses: {
        networks: '/auth/users/{user_id}/accesses/networks',
        regions: '/auth/users/{user_id}/accesses/regions',
        stations: '/auth/users/{user_id}/accesses/stations',
        links: '/auth/users/{user_id}/accesses/links',
      },
      singleSession: '/auth/users/sessions/{session_id}',
    },
    groups: {
      all: '/auth/groups',
      single: '/auth/groups/{group_id}',
    },
  },
  otdr: {
    network: {
      all: '/otdr/network',
      single: '/otdr/network/{networkId}',
      allAccess: '/otdr/network/{network_id}/access',
      viewersAccess: '/otdr/network/{network_id}/access/viewers',
      adminAccess: '/otdr/network/{network_id}/access/admin',
      deleteShapefile:'/otdr/network/shapefile/{shapefile_id}',
    },
    region: {
      all: '/otdr/region',
      create: '/otdr/region/network/{network_id}',
      single: '/otdr/region/{region_id}',
      listInNetwork: '/otdr/region/network/{network_id}',
      allAccess: '/otdr/region/{region_id}/access',
      viewersAccess: '/otdr/region/{region_id}/access/viewers',
      adminAccess: '/otdr/region/{region_id}/access/admin',
      listInRegion: '/otdr/region/{region_id}/links',
      updateregionStationList:'/otdr/region/{region_id}/update_stations',
      removeregionStationList:'/otdr/region/{region_id}/update_stations?action_type=remove',
     
      addregionStationList:'/otdr/region/{region_id}/update_stations?action_type=append',
      updateregionLinkList:'/otdr/region/{region_id}/update_links',
      addregionLinkList:'/otdr/region/{region_id}/update_links?action_type=append',
      removeregionLinkList:'/otdr/region/{region_id}/update_links?action_type=remove',
    },
    station: {
      all: '/otdr/station',
      single: '/otdr/station/{station_id}',
      listInRegion: '/otdr/region/{region_id}/stations',
      listInNetwork: '/otdr/station/network/{network_id}',
      allAccess: '/otdr/station/{station_id}/access',
      viewersAccess: '/otdr/station/{station_id}/access/viewers',
      adminAccess: '/otdr/station/{station_id}/access/admin',
      Addadmin:'/otdr/station/{station_id}/access/admin',
      networkstations:'/otdr/station/network/{network_id}',
      stationrtuList:'/otdr/station/{station_id}/rtus'
    },
    link: {
      all: '/otdr/link',
      listInRegion: '/otdr/region/{region_id}/links',
      create: '/otdr/link/',
      single: '/otdr/link/{link_id}',
      allAccess: '/otdr/link/{link_id}/access',
      viewersAccess: '/otdr/link/{link_id}/access/viewers',
      updatecableandduct:'/otdr/link/{link_id}/cables_and_ducts',
      Addadmin:'/otdr/link/{link_id}/access/admin'
    },
    rtu:{
      create:'/otdr/rtu/',
      single:"/otdr/rtu/{rtu_Id}",
      update:"/otdr/rtu/{rtu_id}",
      ports:"/otdr/rtu/{rtu_id}/ports"
    },
    opticalroute:{
      create:'/otdr/optical-route/',
      networkOpticallist:"/otdr/optical-route/",
      opticalrouteDetail:"/otdr/optical-route/{optical_route_id}",
      opticalrouteUpdate:"/otdr/optical-route/{optical_route_id}"
    },
    map:{
      single:'/otdr/map/{network_id}'
    }
  },
};
