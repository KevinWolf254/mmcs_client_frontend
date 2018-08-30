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

export class NewUnitsRequest implements request{
    requestedUnits: string;
    mpesaTransNo: string;

    constructor(requestedUnits?: string, mpesaTransNo?: string){
        this.requestedUnits = requestedUnits;
        this.mpesaTransNo = mpesaTransNo;
    }
}