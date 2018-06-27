import { Client } from "./client.model";

export class ClientTeleco extends Client{
    telecom: string;

    constructor(clientId: number, countryCode: string, phoneNo: number, fullName: string, telecom: string){
        super(clientId, countryCode, phoneNo, fullName);
        this.telecom = telecom;
    }
}
