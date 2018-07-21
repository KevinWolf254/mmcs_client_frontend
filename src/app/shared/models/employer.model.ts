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

export class UnitsDetailsRequest extends Employer{
    adminEmail: string;
    constructor(id?: number, name?: string, adminEmail?: string,){
        super(id, name);
        this.adminEmail = adminEmail;
    }
}

export class UnitsDetailsResponse extends UnitsDetailsRequest{
    unitsAvailable: number;
    requestsPendingApproval: number;
    requestsPendingApprovalAmount: number;
}

export class UnitsRequest extends UnitsDetailsRequest{
    unitsRequested: number;
    mpesaTransNo: string;

    constructor(id?: number, name?: string, adminEmail?: string, unitsRequested?: number, mpesaTransNo?: string){
        super(id, name, adminEmail);
        // this.name = name;
        this.unitsRequested = unitsRequested;
        this.mpesaTransNo = mpesaTransNo;
        //in aeon api remember to add date
    }
}
