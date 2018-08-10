import { Schedule, NoSchedule } from "./schedule.model";

export interface Sms {
    message: string;
    schedule: Schedule;
    groupIds: number[];
}

export class SmsToAll implements Sms {    
    message: string;
    schedule: Schedule;
    groupIds: number[];

    constructor(message?: string) {
        this.message = message;
        this.schedule = new NoSchedule;
        this.groupIds = [];
    }
}

export class SmsToGroup implements Sms {    
    message: string;
    schedule: Schedule;
    groupIds: number[];

    constructor(message?: string, schedule?: Schedule, 
        groupIds?: number[]) {
        this.message = message;
        this.schedule = schedule;
        this.groupIds = groupIds;
    }
}

/*
// export class SmsGroup extends Sms{
//     groups: number[];

//     constructor(message?: string, groups?: number[]){
//         super(message);
//         this.groups = groups;
//     }

// }

// export class SmsScheduled extends SmsGroup{
//     campaignName: string;
//     campaignType: string;
//     time: Time;

//     constructor(message?: string, groups?: number[], 
//         campaignName?: string, campaignType?: string, time?: Time){
//         super(message, groups);
//         this.campaignName = campaignName;
//         this.campaignType = campaignType;
//         this.time = time;
//     }

//     getCronExpression(): string{
//         let hour: number = this.time.hours;
//         let minute: number = this.time.minutes;
//         // cron expression: fires daily
//         return "0 "+minute+" "+hour+" ? * *";
//     }
// }

// export class SmsScheduledOnce extends SmsScheduled{
//     date: Date; 

//     constructor(message?: string, groups?: number[], 
//         campaignName?: string, campaignType?: string, time?: Time, 
//         date?: Date){
//         super(message, groups, campaignName, campaignType, time);
//         this.date = date
//     }
//     getCronExpression(): string{
//         return '';
//     }
// }

// export class SmsScheduledWeekly extends SmsScheduled{
//     dayOfWeek: string;

//     constructor(message?: string, groups?: number[], 
//         campaignName?: string, campaignType?: string, time?: Time, 
//         dayOfWeek?: string){
//         super(message, groups, campaignName, campaignType, time);
//         this.dayOfWeek = dayOfWeek;
//     }

//     getCronExpression(): string{
//         let hour: number = this.time.hours;
//         let minute: number = this.time.minutes;
//         // cron expression: fires weekly
//         return "0 "+minute+" "+hour+" ? * "+this.dayOfWeek+" *";
//     } 
// }

// export class SmsScheduledMonthly extends SmsScheduled{
//     dayOfMonth: number;

//     constructor(message?: string, groups?: number[], 
//         campaignName?: string, campaignType?: string, time?: Time, 
//         dayOfMonth?: number){
//         super(message, groups, campaignName, campaignType, time);
//         this.dayOfMonth = dayOfMonth;
//     }
//     getCronExpression(): string{
//         let hour: number = this.time.hours;
//         let minute: number = this.time.minutes;
//         // cron expression: fires monthly
//         return "0 "+minute+" "+hour+" "+this.dayOfMonth+" * ?";
//     } 
// }
*/