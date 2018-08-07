import { Time } from "../../../../node_modules/@angular/common";

// export class Schedule {
//     jobName: string;
//     scheduleTime: Date;
//     lastFiredTime: Date;
//     groupName: string;
//     jobStatus: string;
//     nextFireTime: Date;

//     constructor(jobName?: string, groupName?: string, scheduleTime?: 
//         Date, lastFiredTime?: Date, jobStatus?: string, nextFireTime?: Date){
//         this.jobName = jobName;
//         this.scheduleTime = scheduleTime;
//         this.lastFiredTime = lastFiredTime;
//         this.groupName = groupName;
//         this.jobStatus = jobStatus;
//         this.nextFireTime = nextFireTime;
//     }
// }

export enum Days{
    SUNDAY = 'Sunday', MONDAY = 'Monday', TUESDAY = 'Tuesday',
    WEDNESDAY = 'Wednesday', THURSDAY = 'Thursday', FRIDAY = 'Friday',
    SATURDAY = 'Saturday'
}

export interface Schedule{
    scheduleName: string;
    scheduleType: string;
    time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    getScheduleName(): string;
    getScheduleType(): string;
    getScheduledDate(): Date;
    getScheduledTime(): Time;
    getScheduledDayOfWeek(): Days;
    getScheduledDayOfMonth(): number;
    getCronExpression(): string;
}

// export abstract class ScheduleToAll{
//     public scheduleName: string;
//     public scheduleType: string;
//     public time: Time;
//     public date: Date;
//     public dayOfWeek: string;
//     public dayOfMonth: number;
//     public cronExpression: string;

//     public getScheduleName(): string{
//         return this.scheduleName;
//     }
//     public getScheduleType(): string{
//         return this.scheduleType;
//     }
//     public getScheduledDate(): Date{
//         return this.date;
//     }
//     public getScheduledTime(): Time{
//         return this.time;
//     }
//     public getScheduledDayOfWeek(): string{
//         return this.dayOfWeek;
//     }
//     public getScheduledDayOfMonth(): number{
//         return this.dayOfMonth;
//     }
//     public getCronExpression(): string{
//         return this.cronExpression;
//     }
// }

export class NoSchedule implements Schedule{
    scheduleName: string;    
    scheduleType: string;
    time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(){}
    
    getScheduleName(): string {
        return '';
    }
    getScheduleType(): string {
        return '';
    }
    getScheduledDate(): Date {
        return null;
    }
    getScheduledTime(): Time {
        return null;
    }
    getScheduledDayOfWeek(): Days {
        return null;
    }
    getScheduledDayOfMonth(): number {
        return null;
    }
    getCronExpression(): string {
        return '';
    }
}

/*
*Simple schedule that sends an sms 
*on a particular date, once.
*/
export class ScheduleDate implements Schedule{
    scheduleName: string;    
    scheduleType: string;
    time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: string, date?: Date,
        time?: Time) {
        this.scheduleName = scheduleName;
        this.scheduleType = scheduleType;
        this.date = date;
        this.time = time;
        this.dayOfWeek = null;
        this.dayOfMonth = null;
        this.cronExpression = '';
    }
    getScheduleName(): string {
        return this.scheduleName;
    }
    getScheduleType(): string {
        return this.scheduleType;
    }
    getScheduledDate(): Date {
        return this.date;
    }
    getScheduledTime(): Time {
        return this.time;
    }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
}

/*
*Simple schedule that sends an sms 
*on a weekly basis.
*/
export class ScheduleWeekly implements Schedule{
    scheduleName: string;    
    scheduleType: string;
    time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: string, date?: Date,
        time?: Time, dayOfWeek?: Days) {
        this.scheduleName = scheduleName;
        this.scheduleType = scheduleType;
        this.date = date;
        this.time = time;
        this.dayOfWeek = dayOfWeek;
        this.dayOfMonth = null;
        this.cronExpression = this.setCronExpression();
    }
    getScheduleName(): string {
        return this.scheduleName;
    }
    getScheduleType(): string {
        return this.scheduleType;
    }
    getScheduledDate(): Date {
        return this.date;
    }
    getScheduledTime(): Time {
        return this.time;
    }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(): string{        
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires weekly
        return "0 "+minute+" "+hour+" ? * "+this.dayOfWeek+" *";
    }
}

/*
*Simple schedule that sends an sms 
*on a monthly basis.
*/
export class ScheduleMonthly implements Schedule{
    scheduleName: string;    
    scheduleType: string;
    time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: string, date?: Date,
        time?: Time, dayOfMonth?: number) {
        this.scheduleName = scheduleName;
        this.scheduleType = scheduleType;
        this.date = date;
        this.time = time;
        this.dayOfMonth = dayOfMonth;
        this.cronExpression = this.setCronExpression();
    }
    getScheduleName(): string {
        return this.scheduleName;
    }
    getScheduleType(): string {
        return this.scheduleType;
    }
    getScheduledDate(): Date {
        return this.date;
    }
    getScheduledTime(): Time {
        return this.time;
    }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(): string {
        let hour: number = this.time.hours;
        let minute: number = this.time.minutes;
        // cron expression: fires monthly
        return "0 " + minute + " " + hour + " " + this.dayOfMonth + " * ?";
    }
}