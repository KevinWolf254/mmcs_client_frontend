import { SmsScheduled } from "./sms-scheduled.model";
import { Time } from "@angular/common";

export class SmsScheduledWeekly extends SmsScheduled{
    dayOfWeek: string;

    constructor(campaignName: string, campaignType: string, mesage: string, groups: number[], dayOfWeek: string, time: Time){
        super(campaignName, campaignType, mesage, groups, time);
        this.dayOfWeek = dayOfWeek;
    }

    getCronExpression(): string{
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires weekly
        return "0 "+minute+" "+hour+" ? * "+this.dayOfWeek+" *";
    }
}
