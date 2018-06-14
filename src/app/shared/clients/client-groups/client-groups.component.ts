import { Component, OnInit } from '@angular/core';
import { Group } from '../../models/group.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';

@Component({
  selector: 'app-client-groups',
  templateUrl: './client-groups.component.html',
  styleUrls: ['./client-groups.component.scss']
})
export class ClientGroupsComponent implements OnInit {

  private selected = 0;
  private groups: Group[] = [];
  private createForm: FormGroup;
  private deleteForm: FormGroup;

  constructor(private _fb: FormBuilder) { 
    this.createForm = _fb.group({
      'name': [null,Validators.required]
    });
    this.deleteForm = _fb.group({
      'group': ['0',selectValidator]
    });
  }

  ngOnInit() {
    this.getGroups();
  }
  /*retrieves all groups from web service to select */
  private getGroups(){
    let receivedGroup: Group;
    for(let i=1; i<11; i++){
        receivedGroup = new Group(i, "Group "+i);
        this.groups.push(receivedGroup);
    } 
  } 

  private create(form){

  }
  
  private delete(form){

  }
}
