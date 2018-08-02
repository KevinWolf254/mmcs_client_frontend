export interface response{

}

export class UnitsDetailsResponse implements response{
    country: string;
    unitsAvailable: number;
    requestsPendingApproval: number;
    requestsPendingApprovalAmount: number;
    constructor(country?: string, unitsAvailable?: number, requestsPendingApproval?: number, 
        requestsPendingApprovalAmount?: number){
            this.country = country;
            this.unitsAvailable = unitsAvailable;
            this.requestsPendingApproval = requestsPendingApproval;
            this.requestsPendingApprovalAmount = requestsPendingApprovalAmount;
    }
}