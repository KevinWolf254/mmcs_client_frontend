import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';

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

  public saveNewUser(surname: string, otherNames: string, email: string, role: string, password: string){
    let userData = "surname="+surname+"&otherNames="+otherNames+"&email="+email+"&role="+role+
    "&password="+password;
    return this._http.post<any>(this.basicUri + "/secure/users/create", userData, this.authHeader);
  }

  public getUsers():Observable<User>{
    return this._http.get<User>(this.basicUri + "/secure/users");
  }

  public updateUser(user: User):Observable<User>{
    let user_role: string = this.getRole(user.role);
    let userData = "surname="+user.surname+
    "&otherNames="+user.otherNames+
    "&email="+user.email+
    "&role="+user_role+
    "&isactive="+user.isActive;
    return this._http.put<User>(this.basicUri + "/secure/users", userData, this.authHeader);
  }

  public deletUser(userId: number){
    return this._http.delete(this.basicUri + "/secure/users/" + userId);
  }

  private getRole(role: string): string{
    if(role == "ADMIN")
      return "ROLE_ADMIN";
    else if(role == "USER")
      return "ROLE_USER";
    else
      return role;
  }
}
