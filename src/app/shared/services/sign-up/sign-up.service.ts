import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SignUpService {
  private Uri: string = "http://localhost:8083/mmcs";
  private header = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded', 'No-Auth':'true'})};

  constructor(private _http: HttpClient) { }

  public registerInClientServer(surname: string, otherNames: string, country: string, code: string,
    phoneNo: string, organisation: string, email: string, senderId: string, password: string): Observable<any>{
      let clientRegUri: string = this.Uri+"/register";
      let clientRegData = "surname="+surname+
      "&otherNames="+otherNames+
      "&organisation="+organisation+
      "&country="+country+
      "&code="+code+
      "&phoneNo="+phoneNo+
      "&email="+email+
      "&senderId="+senderId+
      "&password="+password;
      return this._http.post<any>(clientRegUri, clientRegData, this.header);
  }
}
