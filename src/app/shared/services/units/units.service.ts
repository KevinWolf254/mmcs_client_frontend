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
  private aeonTechUri = "http://localhost:8081/aeon/bulk-sms";

  private unitsRequestDetails: UnitsDetailsResponse;

   unitsAvailable: number = 0;
   unitsSpentCurrentMonth: number = 0;
   pendingRequestsResponse: any;

  constructor(private _http: HttpClient) {}

  public sendRequestForUnitsAvailable(request: UnitsDetailsRequest): Observable<UnitsDetailsResponse>{
    return this._http.post<UnitsDetailsResponse>(this.basicUri, request, this.httpHeader).pipe(
      retry(2)
    );
  }

  public updateUnitsAvailable(request: UnitsDetailsRequest){
    this.sendRequestForUnitsAvailable(request).subscribe(
      (response: UnitsDetailsResponse)=>{
       this.unitsRequestDetails = response;
      }
    );
  }

  public getPendingRequests(){
    return this.pendingRequestsResponse = {requests: this.unitsRequestDetails.requestsPendingApproval, 
      totalRequestedAmount: this.unitsRequestDetails.requestsPendingApprovalAmount};
  }
  
  public sendRequestForUnitsToClientWebApi(userDetails: UserDetails, requestedUnits: number, mpesaTransNo: string){
    let unitsRequest: UnitsRequest = new UnitsRequest(userDetails.employer.id, userDetails.employer.name,
      userDetails.email, requestedUnits, mpesaTransNo);
    return this._http.post(this.aeonTechUri, unitsRequest, this.httpHeader).pipe(
      retry(2)
    );
  }

  public getSpentUnitsForMonth(month: number){
    return this._http.get(this.basicUri+'/api/schedule/month/'+month).pipe(
      retry(2)
    );
  }

  // getUnitsAvailable(): number{
  //     return this.unitsRequestDetails.unitsAvailable;
  // }

  // setUnitsAvailableFromWebApi(){
    //sends request to client webapi
    //retrieves client credentials
    //and sends organisation name and id and email to aeontech webapi
    //which responds with units available
    // this.unitsAvailable = 10900;

    //NB: ADD organisation table to client and aeontech db
  // }

  // getUnitsSpentForMonth(month: number): number{
    //sends request to client webapi
    //retrieves expenses for specified month
    // return this.unitsSpentCurrentMonth = 2500;
  // }

  // getPendingRequestsForUnits(){
  //   return this.pendingRequestsResponse = {requests: 2, totalRequestedAmount: 15000};
  // }
}