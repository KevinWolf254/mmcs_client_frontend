import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { UnitsAvailableResponse, UnitsRequest, UnitsAvailableRequest } from '../../models/employer.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UnitsService {
  private basicUri: string = "http://localhost:8081/bulk-sms";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};
  private httpHeader = {headers: new HttpHeaders({'Content-type':'application/json'})};
  private aeonTechUri = "http://localhost:8081/bulk-sms";

  private unitsRequestDetails: UnitsAvailableResponse;

   unitsAvailable: number = 0;
   unitsSpentCurrentMonth: number = 0;
   pendingRequestsResponse: any;

  constructor(private _http: HttpClient) {
    // this.setUnitsAvailableFromWebApi(); 
    console.log("Units: "+this.unitsAvailable); 
  }

  private sendUnitsRequest(request: UnitsAvailableRequest): Observable<UnitsAvailableResponse>{
    return this._http.post<UnitsAvailableResponse>(this.basicUri, request, this.httpHeader).pipe(
      retry(2)
    );
  }

  public updateUnitsAvailable(request: UnitsAvailableRequest){
    this.sendUnitsRequest(request).subscribe(
      (response: UnitsAvailableResponse)=>{
       this.unitsRequestDetails = response;
      }
    );
  }

  private unitsExists(): boolean{
    if(this.unitsAvailable == 0 || this.unitsAvailable == null)
      return true;
    return false;
  }

  public getUnitsAvailable(request: UnitsAvailableRequest): number{
    if(!this.unitsExists)
      return this.unitsAvailable;
    else
      this.updateUnitsAvailable(request);
    return this.unitsAvailable;
  }

  public getPendingRequests(){
    return this.pendingRequestsResponse = {requests: this.unitsRequestDetails.requestsPendingApproval, 
      totalRequestedAmount: this.unitsRequestDetails.requestsPendingApprovalAmount};
  }
  
  public sendRequestForUnitsToClientWebApi(userDetails: UserDetails, requestedUnits: number, mpesaTransNo: string){
    let unitsRequest: UnitsRequest = new UnitsRequest(this.unitsRequestDetails.id, this.unitsRequestDetails.name,
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