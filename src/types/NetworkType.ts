export type NetworkType = {
  id: string;
  name: string;
  version_id: string;
};

export type NetworkDetailType = {
  [x: string]: any;
  id: string;
  name: string;
  version_id: string;
  time_created: string;
  time_updated: string;
  versions: Array<{
    id: string;
    network_id: string;
    owner_id: string;
    name:string;
    description: string;
    time_created: string;
  }>;
};
