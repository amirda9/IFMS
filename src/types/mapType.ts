import { ResourceAccessType, UserRole } from "~/constant/users";
import { AccessEnum } from "./AccessType";
import { string } from "yup";

export type MapType = {
 id: string,
 name: string,
 time_created:string,
 time_updated:string,
 regions: any[],
 stations: any[],
 links: any[]
};