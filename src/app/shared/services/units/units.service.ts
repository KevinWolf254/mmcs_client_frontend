import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { UnitsDetailsResponse, UnitsRequest } from '../../models/employer.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnitsService {
  private basicUri: string = "http://localhost:8083/mmcs";
  private httpHeader = {headers: new HttpHeaders({'Content-type':'application/json'})};
  // private aeonTechUri = "http://localhost:8082/aeon/mmcs";

  constructor(private _http: HttpClient) {}

  // public sendRequestForUnitsAvailable(request: UnitsDetailsRequest): Observable<UnitsDetailsResponse>{
  //   return this._http.post<UnitsDetailsResponse>(this.aeonTechUri+"/units/info", request, this.httpHeader).pipe(
  //     retry(2)
  //   );
  // }

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