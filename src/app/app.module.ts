import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule, NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { AppComponent } from './app.component';
import { AdminModule } from './Admin/admin.module';
import { AdminGuard } from './auth/admin.guard';
import { SharedGuard } from './auth/shared.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupManagerService } from './shared/services/group/group-manager.service';
import { ClientService } from './shared/services/client/client.service';
import { CampaignService } from './shared/services/campaign/campaign.service';
import { UnitsService } from './shared/services/units/units.service';
import { SignInService } from './shared/services/sign-in/sign-in.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './shared/services/auth-interceptor';
import { ToastrModule } from 'ngx-toastr';
import { SignUpService } from './shared/services/sign-up/sign-up.service';
import { AeonService } from './shared/services/aeon/aeon.service';
import { UserService } from './shared/services/user/user.service';
import { CountryService } from './shared/services/country/country.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgbCollapseModule,
    NgxDatatableModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule.forRoot(),
    AdminModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    AdminGuard,
    SharedGuard,
    AeonService,
    SignInService,
    SignUpService,
    UserService,
    GroupManagerService,
    ClientService,
    CampaignService,
    UnitsService,
    CountryService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
