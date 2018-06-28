import { Group } from "./group.model";

export class Campaign {
    scheduleId: number;
    title: string;
    scheduleType: string;
    message: string;
    oneTimeDate: Date;
    dayOfWeek: string;
    dateOfMonth: number;
    time: string;
    groups: Group[];

    constructor(scheduleId?: number, title?: string, scheduleType?: string, message?: string, oneTimeDate?: Date, dayOfWeek?: string, dateOfMonth?: number, time?: string, groups?: Group[]){
        this.scheduleId = scheduleId;
        this.title = title;
        this.scheduleType = scheduleType;
        this.message = message;
        this.oneTimeDate = oneTimeDate;
        this.dayOfWeek = dayOfWeek;
        this.dateOfMonth = dateOfMonth;
        this.time = time;
        this.groups = groups
    }
}
