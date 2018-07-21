import { User } from "./user.model";
import { Credentials } from "./credentials.model";

export class UserCredentials extends User{
    credentials: Credentials = new Credentials();
    
    constructor(id?: number, surname?: string, otherNames?: string, email?: string, role?: string, active?: boolean, lastSignInDate?: Date){
        super(id, surname, otherNames, email);
        this.credentials.active = active;
        this.credentials.role = role;
        this.credentials.lastSignInDate = lastSignInDate;
    } 
}
