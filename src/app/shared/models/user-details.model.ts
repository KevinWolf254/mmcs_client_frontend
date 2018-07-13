import { UserCredentials } from "./user-credentials.model";
import { Employer } from "./employer.model";

export class UserDetails extends UserCredentials{
    employer: Employer = new Employer();

    constructor(userId?: number, firstName?: string, lastName?: string, email?: string, role?: string, active?: boolean, lastSignIn?: Date, employer?: Employer){
        super(userId, firstName, lastName, email, role, active, lastSignIn);
        this.employer = employer;
    }
}
