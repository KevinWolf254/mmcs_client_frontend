import { NgbDate } from "@ng-bootstrap/ng-bootstrap/datepicker/ngb-date";

export class ReportDates{
    from: NgbDate;
    to: NgbDate;
    constructor(from: NgbDate, to: NgbDate){
        this.from = from;
        this.to = to;
    }
}