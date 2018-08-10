import { Injectable } from '@angular/core';
import { GroupManagerService } from '../group/group-manager.service';
import { Client, Contacts, Charges } from '../../models/client.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs/Observable';
import { GroupedContactsRequest } from '../../models/group.model';

@Injectable()
export class ClientService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};
  private fileHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};
  clients: Client[] = [];

  constructor(private _http: HttpClient, private _groupManager: GroupManagerService) { }

  public createClient(client: Client){
    return this._http.post(this.basicUri + "/secure/contact", client, this.jsonHeader);
  }

  public createClients(file: File){
    let formData: FormData = new FormData();    
    formData.append("file", file, file.name);
    return this._http.post(this.basicUri + "/secure/contacts", formData, this.fileHeader);
  }

  // findClientsByGroupId(groupId: number): Client[]{
  //   if(this._groupManager.findGroup(groupId) != null){ 
  //     let client: Client;     
  //     for(let i=1; i<=50; i++){
  //       client = new Client(i, '+254', 724000000 + i, 'Client '+i);
  //       this.clients.push(client);
  //     }
  //     return this.clients;
  //   }
  //   return [];
  // }

  public getNoOfContacts(): Observable<Contacts>{
    return this._http.get<any>(this.basicUri + "/secure/contact");
  }

  public getNoOfContactsByGroup(groupIds: number[]): Observable<Contacts>{
    let request: GroupedContactsRequest = new GroupedContactsRequest(groupIds);
    return this._http.post<any>(this.basicUri + "/secure/group/contacts", request, this.jsonHeader);
  }

  public getCharges(): Observable<Charges>{
    return this._http.get<any>(this.basicUri + "/secure/charges");
  }

  public calculateNoOfContacts(contacts: Contacts): number{
    let rwfContacts = contacts.rwf;
    let kesContacts = contacts.kes;
    let kesAirContacts = contacts.kesAir;
    let tzsContacts = contacts.tzs;
    let ugxContacts = contacts.ugx;
    let ugxAirContacts = contacts.ugxAir;
    let otherContacts = contacts.other;

    return rwfContacts+kesContacts+kesAirContacts
    +tzsContacts+ugxContacts+ugxAirContacts+otherContacts;
  }

  public calculateCharges(charges: Charges, contacts: Contacts): number{
    let rwfCharges = charges.rwf;
    let kesCharges = charges.kes;
    let kesAirCharges = charges.kesAir;
    let tzsCharges = charges.tzs;
    let ugxCharges = charges.ugx;
    let ugxAirCharges = charges.ugxAir;
    let otherCharges = charges.other;

    return (rwfCharges * contacts.rwf) +
      (kesCharges * contacts.kes) +
      (kesAirCharges * contacts.kesAir) +
      (tzsCharges * contacts.tzs) +
      (ugxCharges * contacts.ugx) +
      (ugxAirCharges * contacts.ugx) +
      (otherCharges * contacts.other);
  }
}
