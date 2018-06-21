export class Schedule {
    jobName: string;
    scheduleTime: Date;
    lastFiredTime: Date;
    groupName: string;
    jobStatus: string;
    nextFireTime: Date;

    constructor(jobName?: string, groupName?: string, scheduleTime?: Date, lastFiredTime?: Date, jobStatus?: string, nextFireTime?: Date){
        this.jobName = jobName;
        this.scheduleTime = scheduleTime;
        this.lastFiredTime = lastFiredTime;
        this.groupName = groupName;
        this.jobStatus = jobStatus;
        this.nextFireTime = nextFireTime;
    }
}
