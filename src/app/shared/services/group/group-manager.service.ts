import { Injectable } from '@angular/core';
import { Group } from '../../models/group.model';
import { HttpHeaders, HttpClient } from '../../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs/Observable';

@Injectable()
export class GroupManagerService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};
  private header = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};

  constructor(private _http: HttpClient) {}

  public getGroups(): Observable<Group[]>{
    return this._http.get<any>(this.basicUri + "/secure/group");
  }

  public saveGroup(name: string){
    let requestParam = "name="+name;
    return this._http.post(this.basicUri + "/secure/group", requestParam, this.header);
  }

  public getContactsOfGroup(id: number) {
    return this._http.get(this.basicUri + "/secure/contacts/" + id);
  } 

  public findGroup(groups: Group[], selectedGroupId: number): Group{
    let foundGroup: Group = groups.find((group: Group) =>{
      return group.id == selectedGroupId;
    });
    return foundGroup;
  }

  deleteGroup(groupId: number){
    return this._http.delete(this.basicUri + "/secure/group/"+groupId);
  }
}
