import { Role } from "./user.model";

export interface response{

}

export interface _UserDetails{
    organisation: string;
    surname: string;
    otherNames: string;
    email: string;
    role: Role;
    active: boolean;
    lastSignInDate: Date;
}

export class UnitsDetailsResponse implements response {
    country: string;
    unitsAvailable: number;
    requestsPendingApproval: number;
    requestsPendingApprovalAmount: number;
    constructor(country?: string, unitsAvailable?: number, requestsPendingApproval?: number,
        requestsPendingApprovalAmount?: number) {
        this.country = country;
        this.unitsAvailable = unitsAvailable;
        this.requestsPendingApproval = requestsPendingApproval;
        this.requestsPendingApprovalAmount = requestsPendingApprovalAmount;
    }
}

export interface UnitsResponseSuccess extends response{
    title: string;
    message: string;
} 

export class AvailabilityResponse implements response{
    isAvailable: boolean;
}