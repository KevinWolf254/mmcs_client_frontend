import { UserCredentials } from "./user-credentials.model";

export class UserDetails extends UserCredentials{
    organisation: string;

    constructor(id?: number, firstName?: string, lastName?: string, email?: string, role?: string, active?: boolean, lastSignIn?: string, organisation?: string){
        super(id, firstName, lastName, email, role, active, lastSignIn);
        this.organisation = organisation;
    }
}
