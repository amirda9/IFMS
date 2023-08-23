export const BASE_URL = 'http://37.32.27.143:8080/api';

export const URLS = {
  auth: {
    users: {
      all: '/auth/users',
      single: '/auth/users/{user_id}',
      login: '/auth/users/login',
      refreshToken: '/auth/users/refresh_token',
      changePassword: '/auth/users/{user_id}/change_password',
      groups: '/auth/users/{user_id}/groups',
      accesses: {
        all: '/api/auth/users/{user_id}/accesses?access_type={access_type}&resource_type={resource_type}',
        networks:
          '/auth/users/{user_id}/accesses/networks?access_type={access_type}',
        regions:
          '/auth/users/{user_id}/accesses/regions?access_type={access_type}&network_id={network_id}',
        stations:
          '/auth/users/{user_id}/accesses/stations?access_type={access_type}&network_id={network_id}',
        links:
          '/auth/users/{user_id}/accesses/links?access_type={access_type}&network_id={network_id}',
      },
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
    },
    region: {
      all: '/otdr/region',
      create: '/otdr/region/{network_id}',
      single: '/otdr/region/{region_id}',
      listInNetwork: '/otdr/region/network/{network_id}',
      allAccess: '/otdr/region/{region_id}/access',
      viewersAccess: '/otdr/region/{region_id}/access/viewers',
      adminAccess: '/otdr/region/{region_id}/access/admin',
    },
    station: {
      all: '/otdr/station',
      single: '/otdr/station/{station_id}',
      listInRegion: '/otdr/station/region/{region_id}',
      listInNetwork: '/otdr/station/network/{network_id}',
      allAccess: '/otdr/station/{station_id}/access',
      viewersAccess: '/otdr/station/{station_id}/access/viewers',
      adminAccess: '/otdr/station/{station_id}/access/admin',
    },
    link: {
      listInRegion: '/otdr/link/region/{region_id}',
    },
  },
};
