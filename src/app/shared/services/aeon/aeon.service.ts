import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { catchError, retry } from 'rxjs/operators';
import { EmployerRegistration } from '../../models/employer.model';
@Injectable()
export class AeonService {

  private aeonUri: string = "http://localhost:8082/aeon/mmcs/signin";

  constructor(private _http: HttpClient) { }
  
  public confirmRegisteration(email: string): Observable<EmployerRegistration>{
    // let uri = this.aeonUri+email;
    // console.log(uri);    
    let emailParams = new HttpParams().set('email', email);
    let aeonHeader = {headers: new HttpHeaders({'Content-Type':'application/json', 'No-Auth':'true'})};

    return this._http.post<EmployerRegistration>(this.aeonUri,  {aeonHeader: HttpHeaders, emailParams: HttpParams})//{headers: this.aeonHeader, params: emailParams})
    // .pipe(      
    //   retry(3),
    //   catchError(this.handleError) 
    // );
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
