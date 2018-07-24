import { Component, OnInit } from '@angular/core';
import { Role } from '../../models/credentials.model';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  isAdmin(): boolean{
    if(localStorage.getItem('userRole') == Role.ADMIN)
      return true;
    return false;
  }

}
