
export class User {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;

    constructor(userId: number, firstName: string, lastName: string, email: string){
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
