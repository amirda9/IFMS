export const baseUrl = 'http://37.32.27.143:8080/api/';

export const loginUrl = 'auth/users/login';
export const refreshTokenUrl = 'auth/users/refresh_token';
export const userListUrl = 'auth/users/';
export const networkCreateUrl = 'otdr/network/';
export const networkListUrl = 'otdr/network/';
export const networkDetailUrl = 'otdr/network/{networkId}/';
export const networkAccessListUrl = 'otdr/network/{network_id}/access/';
export const networkAccessListUpdateUrl =
  'otdr/network/{network_id}/access/viewers';
export const groupListUrl = 'auth/groups/';
export const regionListUrl = 'otdr/region/{network_id}/';
export const regionCreateUrl = 'otdr/region/{network_id}/';
export const regionDetailUrl = 'otdr/region/{region_id}/';
export const regionAccessUrl = 'otdr/region/{region_id}/access';
export const regionStationListUrl = 'otdr/station/region/{region_id}';
export const networkUpdateAdminUrl = 'otdr/network/{network_id}/access/admin';
