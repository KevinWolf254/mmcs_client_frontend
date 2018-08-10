import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { JsonWebToken } from '../../models/json-web-token.model';
import { catchError, retry } from 'rxjs/operators';
import { UserDetails } from '../../models/user.model';
import { _UserDetails } from '../../models/response.model';

@Injectable()
export class SignInService {
  private basicUri: string = "http://localhost:8083/mmcs";

  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'Authorization':'Basic dGVzdDAxOnRlc3QwMQ==', 'No-Auth':'true'})};
  
  constructor(private _http: HttpClient) {}
  
  public authenticateUser(email: string, password: string): Observable<JsonWebToken>{
    let authUri: string = this.basicUri+"/oauth/token";
    let oAuthData = "grant_type=password"+"&username="+email+"&password="+password;
    return this._http.post<JsonWebToken>(authUri, oAuthData, this.authHeader);
  }
 
  // public sendRequestForUserDetails(): Observable<UserDetails>{
  //   let credentialsUri: string = this.basicUri+"/secure/signin";
  //   return this._http.get<UserDetails>(credentialsUri)
  //   .pipe(
  //     retry(3), 
  //     catchError(this.handleError) 
  //   );
  // }
  public sendRequestForUserDetails(): Observable<_UserDetails>{
    let signInUri: string = this.basicUri+"/secure/signin";
    return this._http.get<_UserDetails>(signInUri)
    .pipe(
      retry(3), 
      catchError(this.handleError) 
    );
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
}
