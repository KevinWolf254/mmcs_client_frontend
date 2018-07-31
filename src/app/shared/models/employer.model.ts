export class Employer {
    id: number;
    name: string;
    constructor(id?: number, name?: string){
        this.id = id;
        this.name = name;
    }
}
export class EmployerRegistration extends Employer{
    enabled: boolean;
    constructor(id?: number, name?: string, enabled?: boolean){
        super(id, name);
        this.enabled = enabled;
    }
}

// export class UnitsDetailsRequest extends Employer{
//     adminEmail: string;
//     constructor(id?: number, name?: string, adminEmail?: string,){
//         super(id, name);
//         this.adminEmail = adminEmail;
//     }
// }

export class UnitsDetailsResponse{
    country: Country;
    unitsAvailable: number;
    requestsPendingApproval: number;
    requestsPendingApprovalAmount: number;
    constructor(country?: Country, unitsAvailable?: number, requestsPendingApproval?: number, 
        requestsPendingApprovalAmount?: number){
            this.country = country;
            this.unitsAvailable = unitsAvailable;
            this.requestsPendingApproval = requestsPendingApproval;
            this.requestsPendingApprovalAmount = requestsPendingApprovalAmount;
    }
}

export class UnitsRequest {
    requestedBy: string;
    requestedUnits: number;
    mpesaTransNo: string;

    constructor(requestedBy?: string, requestedUnits?: number, mpesaTransNo?: string){
        this.requestedBy = requestedBy;
        this.requestedUnits = requestedUnits;
        this.mpesaTransNo = mpesaTransNo;
    }
}

export enum Country{
    RWANDA, KENYA, TANZANIA, UGANDA
}