export class Employer {
    id: number;
    name: string;
}

export class UnitsAvailableRequest extends Employer{
    adminEmail: string;
}

export class UnitsAvailableResponse extends UnitsAvailableRequest{
    unitsAvailable: number;
    requestsPendingApproval: number;
    requestsPendingApprovalAmount: number;
}

export class UnitsRequest extends UnitsAvailableRequest{
    unitsRequested: number;
    mpesaTransNo: string;

    constructor(id: number, name: string, adminEmail: string, unitsRequested: number, mpesaTransNo: string){
        super();
        this.id = id;
        this.adminEmail = adminEmail;
        this.name = name;
        this.unitsRequested = unitsRequested;
        this.mpesaTransNo = mpesaTransNo;
        //in aeon api remember to add date
    }
}
