import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SignUpService {
  // private aeonUri: string = "http://localhost:8082/aeon/mmcs";
  private clientUri: string = "http://localhost:8083/mmcs";
  private header = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'No-Auth':'true'})};

  constructor(private _http: HttpClient) { }

  // public registerInAeonServer(email:string, organisationName: string): Observable<any>{
  //   let registrationUri: string = this.aeonUri+"/register";
  //   let registrationData = "email="+email+"&organisationName="+organisationName;
  //   return this._http.post<any>(registrationUri, registrationData, this.authHeader);
  // }

  // public registerInClientServer(surname: string, otherNames: string, email: string, 
  //   id: number, orgName: string, password: string){
  //     let clientRegUri: string = this.clientUri+"/register";
  //     let clientRegData = "surname="+surname+"&otherNames="+otherNames+"&email="+email+
  //     "&organisationId="+id+"&organisationName="+orgName+"&password="+password;
  //     return this._http.post<any>(clientRegUri, clientRegData, this.authHeader);
  // }

  public registerInClientServer(org: string, surname: string, otherNames: string, email: string, password: string): Observable<any>{
      let clientRegUri: string = this.clientUri+"/register";
      let clientRegData = "organisationName="+org+"&surname="+surname+"&otherNames="+otherNames+"&email="+email+"&password="+password;
      return this._http.post<any>(clientRegUri, clientRegData, this.header);
  }
}
