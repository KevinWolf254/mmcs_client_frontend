import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { UnitsDetailsResponse } from '../../models/response.model';
import { UnitsRequest } from '../../models/request.model';

@Injectable()
export class UnitsService {
  private basicUri: string = "http://localhost:8083/mmcs/secure/units";
  private httpHeader = {headers: new HttpHeaders({'Content-type':'application/json'})};

  constructor(private _http: HttpClient) {}

  public getUnitsAvailable(): Observable<UnitsDetailsResponse>{
      return this._http.get<UnitsDetailsResponse>(this.basicUri).pipe(
        retry(2)
      );
    }

  public addUnits(requestedUnits: number, mpesaTransNo: string){
    let unitsRequest: UnitsRequest = new UnitsRequest(requestedUnits, mpesaTransNo);
    return this._http.post(this.basicUri, unitsRequest, this.httpHeader).pipe(
      retry(2)
    );
  }

  public setUpCurrency(unitsDetails: UnitsDetailsResponse): string {
    if (unitsDetails.country == "RWANDA")
      return 'rwf ';
    if (unitsDetails.country == "KENYA")
      return 'ksh ';
    if (unitsDetails.country == "TANZANIA")
      return 'tzs ';
    if (unitsDetails.country == "UGANDA")
      return 'ugx ';
  }
}