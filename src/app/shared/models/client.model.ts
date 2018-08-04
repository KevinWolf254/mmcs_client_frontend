export class Client {
    id: number;
    countryCode: string;
    phoneNumber: number;
    name: string;

    constructor(id: number, countryCode: string, phoneNumber: number, name: string){
        this.id = id;
        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
        this.name = name;
    }
}
export interface Contacts {
    rwfContacts: number;
    kesContacts: number;
    tzsContacts: number;
    ugxContacts: number;
}