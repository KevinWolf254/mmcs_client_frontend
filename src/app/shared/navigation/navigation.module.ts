import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { RouterModule } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbCollapseModule
  ],
  exports: [
    TopNavbarComponent,
    SideNavbarComponent
  ],
  declarations: [
    TopNavbarComponent, 
    SideNavbarComponent
  ]
})
export class NavigationModule { }
