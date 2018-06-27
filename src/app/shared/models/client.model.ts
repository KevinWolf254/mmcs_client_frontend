export class Client {
    clientId: number;
    countryCode: string;
    phoneNo: number;
    fullName: string;

    constructor(clientId: number, countryCode: string, phoneNo: number, fullName: string){
        this.clientId = clientId;
        this.countryCode = countryCode;
        this.phoneNo = phoneNo;
        this.fullName = fullName;
    }
}
