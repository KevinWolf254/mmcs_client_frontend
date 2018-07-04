import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';
// import { Employer } from '../../models/employer.model';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SignInService {
  private basicUri: string = "http://localhost:8081/bulk-sms";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};
  
  // private admin = {email:"admin@aeon-tech.co.ke", password: "admin123", role: "admin"};
  // private user = {email:"user@aeon-tech.co.ke", password: "user123", role: "user"};
  // private employer: Employer = {id: 1, name: 'aeon i/o technology solutions'}

  userDetails: UserDetails;

  constructor(private _http: HttpClient) { }

  public authenticateUser(email: String, password: String): Observable<any>{
    let authUri: string = this.basicUri+"/oauth/token";
    let oAuthData = "grant_type=password"+"&username="+email+"&password="+password;
    return this._http.post(authUri, oAuthData, this.authHeader);
  }

  public getUserDetailsFromWebApi(): Observable<any>{
    let credentialsUri: string = this.basicUri+"/api/credentials";
    return this._http.get(credentialsUri);

  }

  // signIn(email: string, password: string): UserDetails{    
  //   let role: string = '';
  //   let date: Date = new Date();
  //   if(email == this.admin.email && password == this.admin.password){
  //     this.userDetails = new UserDetails(1, 'John', 'Doe', 'admin@aeon-tech.co.ke', 'admin', true, date, this.employer);
  //   }else if(email == this.user.email && password == this.user.password){
  //     this.userDetails = new UserDetails(2, 'Jane', 'Doe', 'user@aeon-tech.co.ke', 'user', true, date, this.employer);
  //   }
  //   return this.userDetails;
  // } 

  // getUserDetails(): UserDetails{
  //   return this.userDetails;
  // } 

  changePassword(currentPass: string, newPass: string){
    //send to client webApi
  }
}
