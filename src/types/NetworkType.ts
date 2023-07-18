export type NetworkType = {
  id: string;
  name: string;
  version_id: string;
};

export type NetworkDetailType = {
  id: string;
  name: string;
  version_id: string;
  versions: Array<{
    id: string;
    network_id: string;
    owner_id: string;
    description: string;
  }>;
  users: Array<{
    id: string;
    username: string;
    email: string;
    time_created: string;
    is_valid: boolean;
  }>;
};
