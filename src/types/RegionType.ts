export type RegionListType = {
  id: string;
  name: string;
  version_id: string;
  network_id: string;
  owner_id: string;
  time_created: string;
  time_updated: string;
};

export type RegionType = {
  id: string;
  name: string;
  network_id: string;
  version_id: string;
  owner_id: string;
  time_created: string;
  time_updated: string;
  current_version:{
    id:string;
    region_id:string;
    time_created:string;
    owner:{
      id:string;
      username:string;
    },
    description:string;
  },
  versions: Array<{
    id: string;
    region_id: string;
    owner_id: string;
    time_created: string;
    description: string;
  }>;
};
