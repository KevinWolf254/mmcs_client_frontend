export interface request{

}

export class UnitsRequest implements request{
    requestedBy: string;
    requestedUnits: number;
    mpesaTransNo: string;

    constructor(requestedBy?: string, requestedUnits?: number, mpesaTransNo?: string){
        this.requestedBy = requestedBy;
        this.requestedUnits = requestedUnits;
        this.mpesaTransNo = mpesaTransNo;
    }
}