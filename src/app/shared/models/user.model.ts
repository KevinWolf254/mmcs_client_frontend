import { Credentials, Role } from "./credentials.model";
import { Employer } from "./employer.model";
import { _UserDetails } from "./response.model";

// export class User {
//     id: number;
//     surname: string;
//     otherNames: string;
//     email: string;

//     constructor(id: number, surname: string, otherNames: string, email: string){
//         this.id = id;
//         this.surname = surname;
//         this.otherNames = otherNames;
//         this.email = email;
//     }
// }

// export class UserCredentials extends User{
//     credentials: Credentials = new Credentials();
    
//     constructor(id?: number, surname?: string, otherNames?: string, email?: string, 
//         role?: string, active?: boolean, lastSignInDate?: Date){
//         super(id, surname, otherNames, email);
//         this.credentials.active = active;
//         this.credentials.role = role;
//         this.credentials.lastSignInDate = lastSignInDate;
//     } 
// }

// export class UserDetails extends UserCredentials{
//     employer: Employer = new Employer();  

//     constructor(userId?: number, surname?: string, otherNames?: string, email?: string,
//          role?: string, active?: boolean, lastSignIn?: Date, employer?: Employer){
//         super(userId, surname, otherNames, email, role, active, lastSignIn);
//         this.employer = employer;
//     }
// }

export class User implements _UserDetails{
    organisation: string;    
    surname: string;
    otherNames: string;
    email: string;
    role: Role;
    isActive: boolean;
    lastSignInDate: Date;

}

export class OrganisationUser{
    id: number;    
    surname: string;
    otherNames: string;
    email: string;
}