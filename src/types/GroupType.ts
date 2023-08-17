import {UserListType} from '~/types/UserType';

export type GroupType = {
  name: string;
  id: string;
  users: UserListType[];
};

export type GroupDetailType = {
  name: string;
  id: string;
  owner: string;
  users: UserListType[];
  time_created?: string; // Times are in ISO 8601
  time_updated?: string;
};
