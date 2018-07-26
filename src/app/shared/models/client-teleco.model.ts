import { Client } from "./client.model";

export class ClientTeleco extends Client{
    telecom: string;

    constructor(id: number, countryCode: string, phoneNumber: number, name: string, telecom: string){
        super(id, countryCode, phoneNumber, name);
        this.telecom = telecom;
    }
}
