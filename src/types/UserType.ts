import {UserRole} from '~/constant/users';

export type UserListType = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
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
  role: UserRole;
  name: string;
  email: string;
  station: {
    name: string;
    id: string;
  } | null;
  region: {
    name: string;
    id: string;
  } | null;
  is_valid: boolean;
  telephone: string | null;
  mobile: string | null;
  address: string | null;
  comment: string | null;
  time_created: string; // In ISO 8601 format
  time_updated?: string; // In ISO 8601 format
};

export type UserDetailFormType = {
  username: string;
  name: string | null;
  telephone: string | null;
  mobile: string | null;
  email: string;
  address: string | null;
  comment: string | null;
  region_id: string | null;
  station_id: string | null;
};
