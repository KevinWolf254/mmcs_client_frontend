import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsComponent } from '../units/units.component';
import { CampaignService } from '../../shared/services/campaign/campaign.service';
import { MonthlyExpenditure } from '../../shared/models/monthly-expenditure.model';
import { UnitsService } from '../../shared/services/units/units.service';
import { UnitsDetailsResponse, UnitsDetailsRequest } from '../../shared/models/employer.model';
import { UserDetails } from '../../shared/models/user-details.model';
import { SignInService } from '../../shared/services/sign-in/sign-in.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public unitsDetails: UnitsDetailsResponse;
    public unitsAvailableIsLoaded: boolean = true;

    public unitsSpentPreviousMonth: number = 0;

    public years: number[] = new Array(10);

    public date: Date = new Date();
    public currentYear: number = this.date.getFullYear();

    private expenditures: MonthlyExpenditure[] = [];

    constructor(private modalService: NgbModal, private campaignService: CampaignService,
        private signInService: SignInService, private unitsService: UnitsService) { }

    ngOnInit() {
        this.getUnitsDetails();
        this.getSpentUnits();
        this.calculatePrevious10YearsForSelect();
        this.getMonthlyCampaigns(this.currentYear);
    }

    private getUnitsDetails() {
        this.signInService.sendRequestForUserDetails().subscribe((userDetails: UserDetails) => {
            let request: UnitsDetailsRequest = new UnitsDetailsRequest(userDetails.employer.id, userDetails.employer.name, userDetails.email);
            this.unitsService.sendRequestForUnitsAvailable(request).subscribe((response: UnitsDetailsResponse) => {
                this.unitsDetails = response;
                this.unitsAvailableIsLoaded = false;
            });
        });
    }

    private getSpentUnits() {
        this.unitsSpentPreviousMonth = 5000;
    }

    private calculatePrevious10YearsForSelect() {
        for (let i = 0; i < 10; i++) {
            this.years[i] = this.currentYear;
            this.currentYear--;
        }
    }

    public getMonthlyCampaigns(year: number) {
        this.expenditures = this.campaignService.getExpenditures(year);
        let onDemandLabel: string = '';
        let campaignsLabel: string = '';
        let onDemandMonthlyData: number[] = [];
        let campaignMonthlyData: number[] = [];

        this.expenditures.forEach((expense, index) => {
            if (index == 0) {
                onDemandLabel = expense.label;
                onDemandMonthlyData = expense.monthlyExpenditure;
            } else {
                campaignsLabel = expense.label;
                campaignMonthlyData = expense.monthlyExpenditure;
            }
        });
        let months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

        let myChart = new Chart('monthlyCampaigns', {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: onDemandLabel,
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                    backgroundColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    data: onDemandMonthlyData
                },
                {
                    label: campaignsLabel,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    data: campaignMonthlyData
                }],
            },
        });
    }

    public onSelectYear(event) {
        this.getMonthlyCampaigns(event.target.value);
    }

    public openUnitsRequestModal() {
        this.modalService.open(UnitsComponent);
    }
}
