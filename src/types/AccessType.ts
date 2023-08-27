import {UserListType} from '~/types/UserType';
export enum AccessEnum {
  admin = 'ADMIN',
  viewer = 'VIEWER',
}
export type AccessListType = {
  user: UserListType;
  access: AccessEnum;
};

export type AccessCreateType = {
  user_id: string;
  access_types: AccessEnum;
};

export type NetworkAccessType = {
  access: AccessEnum;
  network: {id: string; name: string};
};

export type RegionAccessType = {
  access: AccessEnum;
  region: {id: string; name: string};
};

export type StationAccessType = {
  access: AccessEnum;
  station: {id: string; name: string};
};

export type LinkAccessType = {
  access: AccessEnum;
  link: {
    id: string;
    name: string;
    source: {
      id: string;
      name: string;
    };
    destination: {
      id: string;
      name: string;
    };
  };
};
