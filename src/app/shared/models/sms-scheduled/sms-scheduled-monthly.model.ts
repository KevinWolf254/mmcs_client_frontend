import { SmsScheduled } from "./sms-scheduled.model";
import { Time } from "@angular/common";

export class SmsScheduledMonthly extends SmsScheduled{
    dayOfMonth: number;

    constructor(campaignName: string, campaignType: string, mesage: string, groups: number[],  dayOfMonth: number, time: Time){
        super(campaignName, campaignType, mesage, groups, time);
        this.dayOfMonth = dayOfMonth;
    }

    getCronExpression(): string{
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires monthly
        return "0 "+minute+" "+hour+" "+this.dayOfMonth+" * ?";
    } 
}
