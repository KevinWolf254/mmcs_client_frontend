import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { EmployerRegistration } from '../../models/employer.model';
@Injectable()
export class AeonService {

  private aeonUri: string = "http://localhost:8082/aeon/mmcs";
  private authHeader = {headers: new HttpHeaders({'No-Auth':'true'})};

  constructor(private _http: HttpClient) { }
  
  public confirmRegisteration(email: string): Observable<EmployerRegistration>{
    let confirmIsRegisteredUri: string = this.aeonUri+"/signin?email="+email;   
    let emailParams = new HttpParams().set('email', email);
    return this._http.post<EmployerRegistration>(confirmIsRegisteredUri, null, this.authHeader)
  }
}
