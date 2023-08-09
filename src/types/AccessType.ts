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
