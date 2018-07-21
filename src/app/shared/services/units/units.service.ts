import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { UnitsDetailsResponse, UnitsRequest, UnitsDetailsRequest } from '../../models/employer.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnitsService {
  private basicUri: string = "http://localhost:8081/bulk-sms";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};
  private httpHeader = {headers: new HttpHeaders({'Content-type':'application/json'})};
  private aeonTechUri = "http://localhost:8082/aeon/mmcs";

  constructor(private _http: HttpClient) {}

  public sendRequestForUnitsAvailable(request: UnitsDetailsRequest): Observable<UnitsDetailsResponse>{
    return this._http.post<UnitsDetailsResponse>(this.aeonTechUri+"/units/info", request, this.httpHeader).pipe(
      retry(2)
    );
  }
  
  public sendRequestForUnits(userDetails: UserDetails, requestedUnits: number, mpesaTransNo: string){
    let unitsRequest: UnitsRequest = new UnitsRequest(userDetails.employer.id, userDetails.employer.name,
      userDetails.email, requestedUnits, mpesaTransNo);
    return this._http.post(this.aeonTechUri+"/units/add", unitsRequest, this.httpHeader).pipe(
      retry(2)
    );
  }
}