
export class ReportDates{
    orgName: string;
    from: Date;
    to: Date;
    constructor(orgName: string, from: Date, to: Date){
        this.orgName = orgName;
        this.from = from;
        this.to = to;
    }
}