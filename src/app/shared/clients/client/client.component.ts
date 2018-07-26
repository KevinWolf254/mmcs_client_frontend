import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { selectValidator } from '../../validators/select-validator';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { ClientService } from '../../services/client/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  public form: FormGroup;
  public isCreating: boolean = false;
  public isCreatingClients: boolean = false;
  public fileForm: FormGroup;

  codes: string[] = ["+254", "+255", "+256", "+257"];

  _success = new Subject<string>();
  successMessage: string;

  constructor(private _fb: FormBuilder, private clientService: ClientService) { 
    this.form = _fb.group({
      'names': [null],
      'code': [null,Validators.compose([Validators.required, Validators.pattern('[0-9]{3,3}')])],
      'phone': [null,Validators.compose([Validators.required, Validators.pattern('^7[0-9]{8,8}')])]
    });
    this.fileForm = _fb.group({
      'file': [null,Validators.required]
    });
  }

  ngOnInit() {
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  public createClient(form){
    this.isCreating = true;
    let countryCode: string = "+" + form.code
    this.clientService.createClient(new Client(0, countryCode, form.phone, form.names)).subscribe(
      (response: Client) =>{        
        this._success.next("Successfully created Client " + form.names + " with Phone No: " + form.phone);
        this.form.reset();
        this.isCreating = false;
      },error => {
        this._success.error("Error creating Client " + form.names + " with Phone No: " + form.phone);
        this.isCreating = false;
      }
    );   
  }

  public createClients(form){
    this.isCreatingClients = true;
    this.clientService.createClients(form.file).subscribe(
      (response) =>{        
        this._success.next("Successfully created Clients");
        this.fileForm.reset();
        this.isCreatingClients = false;
      },error => {
        this._success.error("Error creating Clients");
        this.isCreatingClients = false;
      }
    );
  }
}
