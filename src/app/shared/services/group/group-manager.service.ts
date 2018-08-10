import { Injectable } from '@angular/core';
import { Group } from '../../models/group.model';
import { HttpHeaders, HttpClient } from '../../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs/Observable';

@Injectable()
export class GroupManagerService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};

  // groups: Group[] = [];

  constructor(private _http: HttpClient) {    
    // this.setGroups();
   }

  public getGroups(): Observable<Group[]>{
    return this._http.get<any>(this.basicUri + "/secure/group");
  }

  // setGroups(){
  //     let receivedGroup: Group;
  //     for(let i=1; i<11; i++){
  //         receivedGroup = new Group(i, "Group "+i);
  //         this.groups.push(receivedGroup);
  //     } 
  // }  

  public findGroup(groups: Group[], selectedGroupId: number): Group{
    let foundGroup: Group = groups.find((group: Group) =>{
      return group.id == selectedGroupId;
    });
    return foundGroup;
  }

  // deleteGroup(removeGroupId: number){
  //   this.groups.forEach((group, index)=>{
  //     if(group.id == removeGroupId){
  //       this.groups.splice(index, 1);
  //     }
  //   });
  // }

  // createGroup(groupName: string){
  //   let lastIndex = this.groups.length - 1;
  //   let newGroup: Group = new Group(lastIndex + 2, groupName);
  //   this.groups.push(newGroup);
  // }
}
