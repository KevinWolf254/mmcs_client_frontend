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

export enum ServiceProvider{
    GENERIC_RW, AIRTEL_RW,
    GENERIC_KE, AIRTEL_KE, 
    GENERIC_TZ, AIRTEL_TZ,
    GENERIC_UG, AIRTEL_UG,
    OTHER
}

export interface Contacts {
    rwf: number;    
        rwfAir: number;
    kes: number;
        kesAir: number;
    tzs: number;
        tzsAir: number;
    ugx: number;
        ugxAir: number;
    other: number;
}
/*
 *what aeon charges to send 
 *sms according to currency
 */
export interface Charges extends Contacts{

}