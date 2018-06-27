import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { selectValidator } from '../validators/select-validator';
import { Group } from '../models/group.model';
import { Subject } from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operators';
import { GroupManagerService } from '../services/group/group-manager.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  private form: FormGroup;
  private fileForm: FormGroup;
  private selectedGroupForSingleClient: number = 0;
  private selectedGroupForMultiClients: number = 0;
  private groups: Group[] = [];
  private phoneNoExists: boolean = false;

  private _success = new Subject<string>();
  private successMessage: string;

  constructor(private _fb: FormBuilder, private _groupManager: GroupManagerService) { 
    this.form = _fb.group({
      'group': ['0',selectValidator],
      'phone': [null,Validators.compose([Validators.required, Validators.pattern('^7[0-9]{8,8}')])],
    });
    this.fileForm = _fb.group({
      'group': ['0',selectValidator],
      'file': [null,Validators.required]
    });
  }

  ngOnInit() {
    this.groups = this._groupManager.getGroups();

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  private addClientToGroup(form){
    console.log(form.phone);
    let selectedGroup = this.findGroupInList();
    this._success.next("Successfully added "+form.phone+" to "+selectedGroup.name);
    this.resetSingleClientForm();
  }

  private findGroupInList(): Group{
    let foundGroup: Group = this.groups.find((group: Group) =>{
      return group.id == this.selectedGroupForSingleClient;
    });
    return foundGroup;
  }

  private addClientsToGroup(form){
    this.resetMultipleClientForm();
  }

  private check(phone){
    console.log(phone);
    this.phoneNoExists = true;
  } 

  private resetSingleClientForm(){
    this.form.reset();
    this.phoneNoExists = false;
    this.form.get("group").setValue(0);
  }

  private resetMultipleClientForm(){
    this.fileForm.reset();
    this.fileForm.get("group").setValue(0);
  }
}
