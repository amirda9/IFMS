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
