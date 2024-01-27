export type LinkType = {
  id: string;
  name: string;
  network_id: string;
  version_id: string;
  owner_id: string;
  time_created: string;
  time_updated: string;
  region_id: string;
};

export type networklinklistType =  {
  id: string,
  name: string,
  network_id: string,
  version_id: string,
  time_created:string,
  time_updated: string,
  region_id: string,
  source: {
    id: string,
    name: string
  },
  destination: {
    id: string,
    name: string
  }
}
export type regionlinklist = {
  id: string,
    name: string,
    source: string,
    destination: string
};