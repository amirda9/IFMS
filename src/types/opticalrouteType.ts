export type opticalroutecreateType = {
 id: string,
 name: string
};

export type opticalrouteDetailType = {
 name: string,
 comment: string,
 test_ready: boolean,
 type:string,
 avg_hellix_factor: number,
 id: string,
 owner: {
   id: string,
   username: string
 },
 time_created:string,
 time_updated:string
};

export type opticalrouteUpdateType = {
  name: string,
  comment: string,
  test_ready: boolean,
  type:string,
  avg_hellix_factor:number,
  id: string,
  time_created: string,
  time_updated:string
}