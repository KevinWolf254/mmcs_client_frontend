import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { JsonWebToken } from '../../models/json-web-token.model';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class SignInService {
  private basicUri: string = "http://localhost:8081/bulk-sms";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};
  private userDetails: UserDetails;
  
  constructor(private _http: HttpClient) { }

  public authenticateUser(email: String, password: String): Observable<JsonWebToken>{
    let authUri: string = this.basicUri+"/oauth/token";
    let oAuthData = "grant_type=password"+"&username="+email+"&password="+password;
    return this._http.post<JsonWebToken>(authUri, oAuthData, this.authHeader);
  }

  public sendRequestForUserDetails(): Observable<UserDetails>{
    let credentialsUri: string = this.basicUri+"/api/credentials";
    return this._http.get<UserDetails>(credentialsUri)
    .pipe(
      retry(3),
      catchError(this.handleError) 
    );
  }

  public setUserDetails(userDetails: UserDetails){
    this.userDetails = userDetails;
  }

  private sendRequest(){
    this.sendRequestForUserDetails().subscribe(
      (userDetails: UserDetails)=>{
        this.userDetails = userDetails;
      }
    );
  }
  public getSignedInUserDetails(): UserDetails{
    if(this.userDetails == null)
      this.sendRequest();
    return this.userDetails;
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Client Side Error: ', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return _throw('Something bad happened; please try again later.');
  };

  changePassword(currentPass: string, newPass: string){
    //send to client webApi
  }
}
