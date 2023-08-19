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

export type StationCreateType = {
  name: string;
  model: string;
  longitude: number;
  latitude: number;
  network_id: string;
  region_id: string;
  description: string;
};

export type StationType = {
  id: string;
  name: string;
  network_id: string;
  version_id: string;
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
