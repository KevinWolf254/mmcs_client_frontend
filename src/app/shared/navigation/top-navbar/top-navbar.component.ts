import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../models/user.model';
import { UnitsService } from '../../services/units/units.service';
import { UnitsDetailsResponse } from '../../models/response.model';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {

  public isCollapsed: boolean = true;
  public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0, 0);
  public currency: string = '';

  constructor(private router: Router, private unitsService: UnitsService) { }

  ngOnInit() {
    this.unitsService.getUnitsAvailable().subscribe(
      (response: UnitsDetailsResponse) => {
          this.unitsDetails = response;
          this.setUpCurrency(response);
      }
  );
  }

  signout(){
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['sigin']);
  }

  private setUpCurrency(unitsDetails: UnitsDetailsResponse){
    this.currency = this.unitsService.setUpCurrency(unitsDetails); 
}

  public isAdmin(): boolean{
    if(localStorage.getItem('userRole') == Role.ADMIN)
      return true;
    return false;
  }
}
