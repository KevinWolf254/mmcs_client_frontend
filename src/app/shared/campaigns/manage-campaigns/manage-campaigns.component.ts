import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manage-campaigns',
  templateUrl: './manage-campaigns.component.html',
  styleUrls: ['./manage-campaigns.component.scss']
})
export class ManageCampaignsComponent implements OnInit {

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  private edit(editModal){
    this.modalService.open(editModal);
  }

}
