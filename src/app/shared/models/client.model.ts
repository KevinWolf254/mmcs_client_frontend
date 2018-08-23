export class Client {
    countryCode: string;
    phoneNumber: string;

    constructor(countryCode: string, phoneNumber: string){
        this.countryCode = countryCode;
        this.phoneNumber = phoneNumber;
    }
}

export class ContactDetails extends Client{
    id: number;
    teleCom: ServiceProvider;
    constructor(id: number, countryCode: string, 
        phoneNumber: string, teleCom: ServiceProvider){
        super(countryCode, phoneNumber)
        this.id = id;
        this.countryCode = countryCode;
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