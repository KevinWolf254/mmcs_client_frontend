import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CampaignService } from '../../services/campaign/campaign.service';

@Component({
  selector: 'app-to-all',
  templateUrl: './to-all.component.html',
  styleUrls: ['./to-all.component.scss']
})
export class ToAllComponent implements OnInit {
  public form: FormGroup;
  public count: number = 0;
  public isLong: boolean = false;

  constructor(private _fb: FormBuilder, private campaignService: CampaignService) { 
    this.form = _fb.group({
      'message': ['',Validators.compose([Validators.required, Validators.maxLength(320)])]
    });
  }

  ngOnInit() {
   this.form.get('message').valueChanges.subscribe(
     message => {
       this.count = message.length;
       if(this.count > 160)
        this.isLong = true;
       else
        this.isLong = false;
     }
   );
  }
  
  public sendSms(form){
    this.campaignService.sendToAll(form.message, this.count).subscribe(
      response =>{

      }
    );
    this.form.get('message').setValue('');
  }
}
