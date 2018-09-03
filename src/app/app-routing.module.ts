import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './shared/sign-in/sign-in.component';
import { UserProfileComponent } from './shared/user-profile/user-profile.component';
import { CampaignsComponent } from './shared/campaigns/campaigns.component';
import { ClientsComponent } from './shared/clients/clients.component';
import { AdminGuard } from './auth/admin.guard';
import { SharedGuard } from './auth/shared.guard';
import { SignUpComponent } from './shared/sign-up/sign-up.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [  
  {path:'signup', component:SignUpComponent},
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
