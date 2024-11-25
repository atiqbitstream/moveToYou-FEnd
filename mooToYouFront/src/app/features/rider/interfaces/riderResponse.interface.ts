import { ERole } from "../enums/roles.enum";

export interface RiderCreateRes {
  username:string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  sector: string;
  street: string;
  cnicNumber: string;
  role:ERole;
  organization:string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}
