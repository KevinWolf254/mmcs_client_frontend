import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { UnitsDetailsResponse } from '../../models/response.model';
import { UnitsRequest } from '../../models/request.model';

@Injectable()
export class UnitsService {
  private basicUri: string = "http://localhost:8083/mmcs";
  private httpHeader = {headers: new HttpHeaders({'Content-type':'application/json'})};

  constructor(private _http: HttpClient) {}

  public getUnitsAvailable(): Observable<UnitsDetailsResponse>{
      return this._http.get<UnitsDetailsResponse>(this.basicUri+"/secure/units").pipe(
        retry(2)
      );
    }

  public addUnits(requestedBy: string, requestedUnits: number, mpesaTransNo: string){
    let unitsRequest: UnitsRequest = new UnitsRequest(requestedBy, requestedUnits, mpesaTransNo);
    return this._http.post(this.basicUri+"/secure/units/add", unitsRequest, this.httpHeader).pipe(
      retry(2)
    );
  }
}