import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  private basicUri: string = "http://localhost:8083/mmcs";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};

  constructor(private _http: HttpClient) { }

  public changePassword(newPass: string): Observable<any>{
    let passUri: string = this.basicUri+"/secure/credentials/change";
    let data = "NewPassword="+newPass;
    return this._http.post<any>(passUri, data, this.authHeader);
  }
}
