import { UserCredentials } from "./user-credentials.model";
import { Employer } from "./employer.model";

export class UserDetails extends UserCredentials{
    // organisation: string;
    employer: Employer = new Employer();

    constructor(id?: number, firstName?: string, lastName?: string, email?: string, role?: string, active?: boolean, lastSignIn?: Date, employer?: Employer){
        super(id, firstName, lastName, email, role, active, lastSignIn);
        this.employer = employer;
    }
}
