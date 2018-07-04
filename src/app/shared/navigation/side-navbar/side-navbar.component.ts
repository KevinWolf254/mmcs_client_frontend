import { Component, OnInit } from '@angular/core';

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
    if(localStorage.getItem('userRole') == 'admin')
      return true;
    return false;
  }

}
