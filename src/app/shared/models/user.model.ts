import { _UserDetails } from "./response.model";

export class User implements _UserDetails{
    organisation: string;    
    surname: string;
    otherNames: string;
    email: string;
    role: Role;
    active: boolean;
    lastSignInDate: Date; 

}

export enum Role{
    ADMIN = "ADMIN", USER = "USER"
  }