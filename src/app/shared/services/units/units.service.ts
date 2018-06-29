import { Injectable } from '@angular/core';

@Injectable()
export class UnitsService {

  private unitsAvailable: number = 0;

  constructor() {
    this.setUnitsAvailableFromWebApi();
  }

  getUnitsAvailable(): number{
    return this.unitsAvailable;
  }

  setUnitsAvailableFromWebApi(){
    this.unitsAvailable = 10000;
  }

  getUnitsSpentForCurrentMonth(month: number){
  }

  sendRequestForUnits(){   
  }

  getPendingRequestsForUnits(){
  }
}