import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ReportDates } from '../../models/report.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';

@Injectable()
export class ReportService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private header = {headers: new HttpHeaders({'Content-Type':'application/json'})};

  constructor(private _http: HttpClient) { }

  requestPurchasesReport(from: NgbDate, to: NgbDate){
    let params = new ReportDates(from, to);
    return this._http.post(this.basicUri + "/secure/reportPDF/purchase", params, 
    this.header);
  }

  requestDeliveryReport(from, to){
    let params = new ReportDates(from, to);
    return this._http.post(this.basicUri + "/secure/reportPDF/delivery", params,
     this.header);
  }

}
