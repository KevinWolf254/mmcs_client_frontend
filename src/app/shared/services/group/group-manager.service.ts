import { Injectable } from '@angular/core';
import { Group } from '../../models/group.model';

@Injectable()
export class GroupManagerService {

  groups: Group[] = [];

  constructor() {    
    this.setGroups();
   }

  getGroups(): Group[]{
    return this.groups;
  }

  setGroups(){
      let receivedGroup: Group;
      for(let i=1; i<11; i++){
          receivedGroup = new Group(i, "Group "+i);
          this.groups.push(receivedGroup);
      } 
  }  

  findGroup(selectedGroupId: number): Group{
    let foundGroup: Group = this.groups.find((group: Group) =>{
      return group.id == selectedGroupId;
    });
    return foundGroup;
  }

  deleteGroup(removeGroupId: number){
    this.groups.forEach((group, index)=>{
      if(group.id == removeGroupId){
        this.groups.splice(index, 1);
      }
    });
  }

  createGroup(groupName: string){
    let lastIndex = this.groups.length - 1;
    let newGroup: Group = new Group(lastIndex + 2, groupName);
    this.groups.push(newGroup);
  }
}
