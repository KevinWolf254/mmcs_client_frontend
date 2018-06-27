import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './shared/sign-in/sign-in.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { CampaignsComponent } from './shared/campaigns/campaigns.component';
import { ClientsComponent } from './shared/clients/clients.component';
import { AdminComponent } from './Admin/admin.component';
import { AdminGuard } from './auth/admin.guard';
import { SharedGuard } from './auth/shared.guard';

const routes: Routes = [
  {path:'signin', component:SignInComponent},
  {path:'dashboard', component:DashboardComponent, canActivate: [AdminGuard]},
  {path:'profile', component:UserProfileComponent, canActivate: [SharedGuard]},
  {path:'admin', component:AdminComponent, canActivate: [AdminGuard]},
  {path:'campaigns', component:CampaignsComponent, canActivate: [SharedGuard]},
  {path:'clients', component:ClientsComponent, canActivate: [SharedGuard]},
  {path:'', redirectTo: 'signin', pathMatch: 'full'},
  {path:'**', redirectTo: 'signin', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
