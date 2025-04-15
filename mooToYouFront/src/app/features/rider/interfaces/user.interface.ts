import { ERole } from "../../shared/enums/roles.enum";

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    sector: string;
    street: string;
    cnicNumber: string;
    email: string;
    role: ERole;
    organization: string;
    organizationId: number;
  }