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