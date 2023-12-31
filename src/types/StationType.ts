export type StationListType = {
  id: string;
  name: string;
  network_id: string;
  version_id: string;
  owner_id: string;
  time_created: string;
  time_updated: string;
  region_id: string;
};
export type regionstationlist = {
  id: string;
  name: string;
  longitude:number;
  latitude:number;
};
export type networkstationslistType = {
    id: string,
    name: string,
    network_id: string,
    time_created:string,
    time_updated:string,
    region_id:string
};
export type stationrtulisttype = {
  id: string,
  name: string,
};
export type StationCreateType = {
  name: string;
  model: string;
  longitude: number;
  latitude: number;
  network_id: string;
 region_id: string | null;
  description: string;
};

export type StationType = {
  current_version: any;
  id: string;
  name: string;
  network_id: string;
  version_id: string;
  region:{id:string,name:string};
  owner_id: string;
  versions: Array<{
    id: string;
    station_id: string;
    model: string;
    longitude: number;
    latitude: number;
    owner_id: string;
    time_created: string;
    description: string;
  }>;
  time_created: string;
  time_update: string;
  region_id: string;
  admin: {id: string; username: string};
};
