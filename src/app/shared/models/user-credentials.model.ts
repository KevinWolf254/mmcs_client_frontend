import { User } from "./user.model";
import { Credentials } from "./credentials.model";

export class UserCredentials extends User{

    credentials: Credentials = new Credentials();
    
    constructor(id: number, firstName: string, lastName: string, email: string, role: string, active: boolean, lastSignIn: Date){
        super(id, firstName, lastName, email);
        this.credentials.active = active;
        this.credentials.role = role;
        this.credentials.lastSignIn = lastSignIn;
    }
}
