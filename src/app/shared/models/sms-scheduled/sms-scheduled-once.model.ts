import { SmsScheduled } from "./sms-scheduled.model";
import { Time } from "@angular/common";

export class SmsScheduledOnce extends SmsScheduled{
    date: Date; 

    constructor(campaignName: string, campaignType: string, mesage: string, groups: number[], date: Date, time: Time){
        super(campaignName, campaignType, mesage, groups, time);
        this.date = date;
    }

    getCronExpression(): string{
        return '';
    }
}
