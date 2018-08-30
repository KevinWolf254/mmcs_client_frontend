import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { ClientService } from '../../services/client/client.service';
import { Client } from '../../models/client.model';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';
import { HttpEventType } from '../../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  public form: FormGroup;
  public isCreating: boolean = false;
  public isCreatingClients: boolean = false;
  contactsChoosen: boolean = false;
  public file: File;

  public fileName: string = '';

  codes: string[] = ["+254", "+255", "+256", "+257"];

  constructor(private _fb: FormBuilder, private clientService: 
    ClientService, private notify: ToastrService) { 
    this.form = _fb.group({
      'code': [null,Validators.compose([Validators.required, 
        Validators.pattern('[0-9]{3,3}')])],
      'phone': [null,Validators.compose([Validators.required, 
        Validators.pattern('^7[0-9]{8,8}')])]
    });
  }

  ngOnInit() {
  }

  public createClient(form){
    this.isCreating = true;
    let countryCode: string = "+" + form.code
    this.clientService.saveClient(new Client(countryCode, form.phone)).subscribe(
      (response: any) =>{        
        this.form.reset();
        this.isCreating = false;        
        this.notify.success(response.message, response.title);
      },error => {
        this.isCreating = false;
        this.notify.error(error.error.error_description, error.error.error);
      }
    );   
  }
  public uploadFile(event){
      this.file = event.target.files[0];
      this.fileName = this.file.name;
      if(this.fileName)
        this.contactsChoosen = true;
  }

  public saveContacts(){
    this.isCreatingClients = true;
    this.clientService.saveClients(this.file).subscribe(
      (response: any) =>{   
        if(response.type === HttpEventType.UploadProgress){
          // console.log("uploading progress: "+ Math.round(100 * response.loaded / response.total) +'%');
        }else if(response.type === HttpEventType.Response){ 
          this.isCreatingClients = false;
          this.fileName = '';      
          this.notify.success(response.body.message, response.body.title);
          this.contactsChoosen = false;
        }
      },error => {
        this.notify.error(error.error.error_description, error.error.error);
        this.isCreatingClients = false;          
      }
    );
  }
}
