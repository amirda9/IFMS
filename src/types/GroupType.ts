import {UserListType} from '~/types/UserType';

export type GroupType = {
  name: string;
  id: string;
  users: UserListType[];
};
