import { ERole } from "../../shared/enums/roles.enum";

export interface Rider {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    role:ERole;
    sector: string;
    street: string;
    cnicNumber: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    organization:string;
  }