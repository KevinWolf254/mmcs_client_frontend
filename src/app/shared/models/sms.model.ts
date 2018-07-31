import { Time } from "@angular/common";

export class Sms {
    message: string;
    count: number;
    constructor(message?: string, count?: number){
        this.message = message;
        this.count = count;
    }
}

export class SmsGroup extends Sms{
    groups: number[];

    constructor(message?: string, count?: number, groups?: number[]){
        super(message, count);
        this.groups = groups;
    }

}

export class SmsScheduled extends SmsGroup{
    campaignName: string;
    campaignType: string;
    time: Time;

    constructor(message?: string, count?: number, groups?: number[], 
        campaignName?: string, campaignType?: string, time?: Time){
        super(message, count, groups);
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

export class SmsScheduledOnce extends SmsScheduled{
    date: Date; 

    constructor(message?: string, count?: number, groups?: number[], 
        campaignName?: string, campaignType?: string, time?: Time, 
        date?: Date){
        super(message, count, groups, campaignName, campaignType, time);
        this.date = date
    }
    getCronExpression(): string{
        return '';
    }
}

export class SmsScheduledWeekly extends SmsScheduled{
    dayOfWeek: string;

    constructor(message?: string, count?: number, groups?: number[], 
        campaignName?: string, campaignType?: string, time?: Time, 
        dayOfWeek?: string){
        super(message, count, groups, campaignName, campaignType, time);
        this.dayOfWeek = dayOfWeek;
    }

    getCronExpression(): string{
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires weekly
        return "0 "+minute+" "+hour+" ? * "+this.dayOfWeek+" *";
    } 
}

export class SmsScheduledMonthly extends SmsScheduled{
    dayOfMonth: number;

    constructor(message?: string, count?: number, groups?: number[], 
        campaignName?: string, campaignType?: string, time?: Time, 
        dayOfMonth?: number){
        super(message, count, groups, campaignName, campaignType, time);
        this.dayOfMonth = dayOfMonth;
    }
    getCronExpression(): string{
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires monthly
        return "0 "+minute+" "+hour+" "+this.dayOfMonth+" * ?";
    } 
}