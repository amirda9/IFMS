export type UserListType = {
  id: string;
  username: string;
  email: string;
  station?: {
    name: string;
  };
  region?: {
    name: string;
  };
};

export type UserDetailType = {
  id: string;
  username: string;
  email: string;
  station: {
    name: string;
  } | null;
  region: {
    name: string;
  } | null;
  is_valid: boolean;
  telephone: string | null;
  mobile: string | null;
  address: string | null;
  comment: string | null;
  time_created: string; // In ISO 8601 format
  time_updated?: string; // In ISO 8601 format
};
