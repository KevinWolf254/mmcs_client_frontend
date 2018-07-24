import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../side-navbar/side-navbar.component';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {

  isCollapsed: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  signout(){
    localStorage.removeItem('userRole');
    this.router.navigate(['sigin']);
  }

  isAdmin(): boolean{
    if(localStorage.getItem('userRole') == Role.ADMIN)
      return true;
    return false;
  }

}
