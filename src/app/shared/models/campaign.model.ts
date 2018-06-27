import { Group } from "./group.model";

export class Campaign {
    scheduleId: number;
    title: string;
    scheduleType: string;
    message: string;
    date: Date;
    time: string;
    groups: Group[];

    constructor(scheduleId?: number, title?: string, scheduleType?: string, message?: string, date?: Date, time?: string, groups?: Group[]){
        this.scheduleId = scheduleId;
        this.title = title;
        this.message = message;
        this.date = date;
        this.time = time;
        this.groups = groups
    }
}
