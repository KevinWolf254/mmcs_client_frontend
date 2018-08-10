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
    SUNDAY = 'SUNDAY', MONDAY = 'MONDAY', TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY', THURSDAY = 'THURSDAY', FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY'
}

export enum ScheduleType{
    DATE = 'DATE', DAILY = 'DAILY', WEEKLY = 'WEEKLY', MONTHLY = 'MONTHLY', 
    NONE = 'NONE'
}

export interface Schedule{
    name: string;
    type: ScheduleType;
    // time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    getScheduleName(): string;
    getScheduleType(): string;
    getScheduledDate(): Date;
    // getScheduledTime(): Time;
    getScheduledDayOfWeek(): Days;
    getScheduledDayOfMonth(): number;
    getCronExpression(): string;
}

export class NoSchedule implements Schedule{    
    name: string;    
    type: ScheduleType;
    // time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(){}
    
    getScheduleName(): string {
        return '';
    }
    getScheduleType(): string {
        return ScheduleType.NONE;
    }
    getScheduledDate(): Date {
        return null;
    }
    // getScheduledTime(): Time {
    //     return null;
    // }
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
*on a daily basis.
*/
export class ScheduleDaily implements Schedule{
    name: string;    
    type: ScheduleType;
    // time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType,
        time?: Time) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setTime(time);
        // this.time = time;
        this.dayOfWeek = null;
        this.dayOfMonth = null;
        this.cronExpression = this.setCronExpression(time);
    }
    getScheduleName(): string {
        return this.name;
    }
    getScheduleType(): string {
        return this.type;
    }
    getScheduledDate(): Date {
         return this.date;
    }
    // getScheduledTime(): Time {
    //     return this.time;
    // }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(time): string {
        let hour: number = time.hour;
        let minute: number = time.minutes;
        // cron expression: fires daily
        return "0 " + minute + " " + hour + " ? * *";
    }
    private setTime(time: Time): Date{ 
        let date: Date = new Date();      
        date.setHours(time.hours);
        date.setMinutes(time.minutes);
        return date;
    }
}

/*
*Simple schedule that sends an sms 
*on a particular date, once.
*/
export class ScheduleDate implements Schedule{
    name: string;    
    type: ScheduleType;
    // time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType, date?: Date,
        time?: Time) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setDateTime(date, time);
        // this.time = time;
        this.dayOfWeek = null;
        this.dayOfMonth = null;
        this.cronExpression = '';
    }
    getScheduleName(): string {
        return this.name;
    }
    getScheduleType(): string {
        return this.type;
    }
    getScheduledDate(): Date {
         return this.date;
    }
    // getScheduledTime(): Time {
    //     return this.time;
    // }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setDateTime(date: Date, time: Time): Date{        
        date.setHours(time.hours);
        date.setMinutes(time.minutes);
        return date;
    }
}

/*
*Simple schedule that sends an sms 
*on a weekly basis.
*/
export class ScheduleWeekly implements Schedule{
    name: string;    
    type: ScheduleType;
    // time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType, date?: Date,
        time?: Time, dayOfWeek?: Days) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setDateTime(date, time);
        // this.time = time;
        this.dayOfWeek = dayOfWeek;
        this.dayOfMonth = null;
        this.cronExpression = this.setCronExpression(time);
    }
    getScheduleName(): string {
        return this.name;
    }
    getScheduleType(): string {
        return this.type;
    }
    getScheduledDate(): Date {
        return this.date;
    }
    // getScheduledTime(): Time {
    //     return this.time;
    // }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(time): string {
        let hour: number = time.hour;
        let minute: number = time.minutes;
        // cron expression: fires weekly
        return "0 "+minute+" "+hour+" ? * "+this.dayOfWeek+" *";
    }
    private setDateTime(date: Date, time: Time): Date{        
        date.setHours(time.hours);
        date.setMinutes(time.minutes);
        return date;
    }
}

/*
*Simple schedule that sends an sms 
*on a monthly basis.
*/
export class ScheduleMonthly implements Schedule{
    name: string;    
    type: ScheduleType;
    // time: Time;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType, date?: Date,
        time?: Time, dayOfMonth?: number) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setDateTime(date, time);
        // this.time = time;
        this.dayOfMonth = dayOfMonth;
        this.dayOfWeek = null;
        this.cronExpression = this.setCronExpression(time);
    }
    getScheduleName(): string {
        return this.name;
    }
    getScheduleType(): string {
        return this.type;
    }
    getScheduledDate(): Date {
        return this.date;
    }
    // getScheduledTime(): Time {
    //     return this.time;
    // }
    getScheduledDayOfWeek(): Days {
        return this.dayOfWeek;
    }
    getScheduledDayOfMonth(): number {
        return this.dayOfMonth;
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(time): string {
        let hour: number = time.hour;
        let minute: number = time.minutes;
        // cron expression: fires monthly
        return "0 " + minute + " " + hour + " " + this.dayOfMonth + " * ?";
    }
    private setDateTime(date: Date, time: Time): Date{        
        date.setHours(time.hours);
        date.setMinutes(time.minutes);
        return date;
    }
}