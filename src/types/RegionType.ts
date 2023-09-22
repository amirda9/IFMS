import { ResourceAccessType, UserRole } from "~/constant/users";
import { AccessEnum } from "./AccessType";

export type RegionListType = {
  id: string;
  name: string;
  version_id: string;
  network_id: string;
  owner_id: string;
  time_created: string;
  time_updated: string;
};
export type LinkCreateType = {
  name: string;
  network_id: string;
  source_id: string;
  destination_id: string;
  link_points: [
    {
      latitude: number;
      longitude: number;
    },
  ];
  // region_id: string;
  description: string;
  type: string;
};


export type LinkType = {
  id: string,
  name: string,
  network_id: string,
  version_id: string,
  time_created: string,
  time_updated: string,
  region_id: string,
  current_version: {
    id: string,
    link_id: string,
    time_created: string,
    owner: {
      id: string,
      username: string
    },
    source: {
      id: string,
      name: string
    },
    destination: {
      id: string,
      name: string
    },
    type:string,
    link_points: [],
    description: string,
    length: 0
  },
  versions: [
    {
      id: string,
      link_id: string,
      time_created: string,
      owner: {
        id: string,
        username: string
      },
      source: {
        id: string,
        name: string
      },
      destination: {
        id: string,
        name: string
      },
      type: string,
      link_points: [],
      description: string,
      length: 0
    }
  ],
  admin: {
    id: string,
    username: string
  },
  access: {
    role: UserRole
    access: AccessEnum;
  },
  region: {
    id: string,
    name: string
  },
  data: {
    cables: [
      {
        id: string,
        number_of_cores: 0,
        segments: [
          {
            start: 0,
            length: 0,
            offset: 0,
            loss: 0,
            fiber_type: string
          }
        ]
      }
    ],
    ducts: [
      {
        id: string,
        mini_ducts: [
          {
            id: string,
            number_of_fibers: 0
          }
        ],
        segments: [
          {
            start: 0,
            length: 0,
            offset: 0,
            loss: 0,
            fiber_type:string
          }
        ]
      }
    ]
  }
}


export type RegionType = {
  id: string;
  name: string;
  network_id: string;
  version_id: string;
  owner_id: string;
  time_created: string;
  time_updated: string;
  current_version:{
    id:string;
    region_id:string;
    time_created:string;
    owner:{
      id:string;
      username:string;
    },
    description:string;
  },
  versions: Array<{
    id: string;
    region_id: string;
    owner_id: string;
    time_created: string;
    description: string;
  }>;
};
