export type RtucreateType = {
  name: string,
  model:string,
  station_id: string,
  contact_person_id: string,
  otdr_ip: string,
  otdr_port: string,
  switch_ip: string,
  switch_port: number,
  subnet_mask: string,
  default_gateway: string,
 id: string
};


export type rtuupdateType = {
  name: string,
  model:string,
  station_id: string,
  contact_person_id: string,
  otdr_ip: string,
  otdr_port: number,
  switch_ip: string,
  switch_port: number,
  subnet_mask: string,
  default_gateway: string,
  id: string
}
export type rtuportType = {
    optical_route_id: string,
    state: string,
    id: string,
    end_station: {
      id: string,
      name: string
    },
    optical_route: {
      id: string,
      name: string
    },
    length: 0
}

export type rtudetailType = {
    name: string,
    model: string,
    station_id: string,
    contact_person_id: string,
    otdr_ip: string,
    otdr_port:number,
    switch_ip: string,
    switch_port:number,
    subnet_mask: string,
    default_gateway: string,
    id: string,
    connection:string,
    status: string,
    last_comm: string,
    last_sync: string,
    time_created: string,
    time_updated: string,
    owner: {
      id: string,
      username: string
    },
    contact_person: {
      id: string,
      username: string
    },
    station: {
      id: string,
      name: string
    }

};