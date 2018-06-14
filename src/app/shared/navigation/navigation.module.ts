import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopNavbarComponent } from './top-navbar/top-navbar.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
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
