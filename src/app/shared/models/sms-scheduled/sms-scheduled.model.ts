import { Time } from "@angular/common";
import { Sms } from "../sms.model";

export class SmsScheduled extends Sms{
    campaignName: string;
    campaignType: string;
    time: Time;

    constructor(campaignName: string, campaignType: string, mesage: string, groups: number[], time: Time){
        super(mesage, groups);
        this.campaignName = campaignName;
        this.campaignType = campaignType;
        this.time = time;
    }

    getCronExpression(): string{
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires daily
        return "0 "+minute+" "+hour+" ? * *";
    }
}
