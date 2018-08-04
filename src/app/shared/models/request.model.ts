export interface request{

}

export class UnitsRequest implements request{
    requestedUnits: number;
    mpesaTransNo: string;

    constructor(requestedUnits?: number, mpesaTransNo?: string){
        this.requestedUnits = requestedUnits;
        this.mpesaTransNo = mpesaTransNo;
    }
}