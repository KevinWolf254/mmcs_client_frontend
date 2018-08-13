import { Time } from "../../../../node_modules/@angular/common";

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
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    getCronExpression(): string;
}

export class NoSchedule implements Schedule{    
    name: string;    
    type: ScheduleType;
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(){}

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
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType,
        time?: Time) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setTime(time);
        this.dayOfWeek = null;
        this.dayOfMonth = null;
        this.cronExpression = this.setCronExpression(time);
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(time: Time): string {
        let hour: number = time.hours;
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
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType, date?: Date,
        time?: Time) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setDateTime(date, time);
        this.dayOfWeek = null;
        this.dayOfMonth = null;
        this.cronExpression = '';
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
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType, time?: Time, 
        dayOfWeek?: Days) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setTime(time);
        this.dayOfWeek = dayOfWeek;
        this.dayOfMonth = null;
        this.cronExpression = this.setCronExpression(time);
    }

    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(time: Time): string {
        let hour: number = time.hours;
        let minute: number = time.minutes;
        let dayAcronym: string = null;
        if(this.dayOfWeek == Days.SUNDAY){
            dayAcronym = "SUN";
        }else if(this.dayOfWeek == Days.MONDAY){
            dayAcronym = "MON";
        }else if(this.dayOfWeek == Days.TUESDAY){
            dayAcronym = "TUE";
        }else if(this.dayOfWeek == Days.WEDNESDAY){
            dayAcronym = "WED";
        }else if(this.dayOfWeek == Days.THURSDAY){
            dayAcronym = "THU";
        }else if(this.dayOfWeek == Days.FRIDAY){
            dayAcronym = "FRI";
        }else if(this.dayOfWeek == Days.SATURDAY){
            dayAcronym = "SAT";
        }
        // cron expression: fires weekly
        return "0 "+minute+" "+hour+" ? * "+dayAcronym+" *";
    }
    private setTime(time: Time): Date{ 
        let date: Date = new Date();      
        date.setHours(time.hours+3);
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
    date: Date;
    dayOfWeek: Days;
    dayOfMonth: number;
    cronExpression: string;

    constructor(scheduleName?: string, scheduleType?: ScheduleType, date?: Date,
        time?: Time, dayOfMonth?: number) {
        this.name = scheduleName;
        this.type = scheduleType;
        this.date = this.setDateTime(date, time);
        this.dayOfMonth = dayOfMonth;
        this.dayOfWeek = null;
        this.cronExpression = this.setCronExpression(time);
    }
    getCronExpression(): string {
        return this.cronExpression;
    }
    private setCronExpression(time: Time): string {
        let hour: number = time.hours;
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