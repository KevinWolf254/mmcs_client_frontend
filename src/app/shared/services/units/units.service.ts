import { Injectable } from '@angular/core';

@Injectable()
export class UnitsService {

  private unitsAvailable: number = 0;
  private unitsSpentCurrentMonth: number = 0;
  private pendingRequestsResponse: any;

  constructor() {
    this.setUnitsAvailableFromWebApi();
  }

  getUnitsAvailable(): number{
    return this.unitsAvailable;
  }

  setUnitsAvailableFromWebApi(){
    //sends request to client webapi
    //retrieves client credentials
    //and sends organisation name and id and email to aeontech webapi
    //which responds with units available
    this.unitsAvailable = 10900;

    //NB: ADD organisation table to client and aeontech db
  }

  getUnitsSpentForMonth(month: number): number{
    //sends request to client webapi
    //retrieves expenses for specified month
    return this.unitsSpentCurrentMonth = 2500;
  }

  sendRequestForUnitsToClientWebApi(requestedUnits: number, mpesaTransNo: string){
    //sends request to client webApi
    //client webapi retrieves org name and id and admin email
    //and client webapi sends the request to aeontech webapi
    //aeontech responds to client with 'request received'

  }

  getPendingRequestsForUnits(){
    return this.pendingRequestsResponse = {requests: 2, totalRequestedAmount: 15000};
  }
}