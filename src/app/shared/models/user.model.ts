
export class User {
    id: number;
    surname: string;
    otherNames: string;
    email: string;

    constructor(id: number, surname: string, otherNames: string, email: string){
        this.id = id;
        this.surname = surname;
        this.otherNames = otherNames;
        this.email = email;
    }
}
