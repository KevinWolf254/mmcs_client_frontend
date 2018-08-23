import { Injectable } from '@angular/core';
import { Client, Contacts, Charges } from '../../models/client.model';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Observable } from '../../../../../node_modules/rxjs/Observable';
import { GroupedContactsRequest } from '../../models/group.model';

@Injectable()
export class ClientService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private jsonHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};
  private header = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};

  constructor(private _http: HttpClient) { }

  public saveClient(contact: Client){
    return this._http.post(this.basicUri + "/secure/contact", contact, this.jsonHeader);
  }

  public saveContactToGroup(contact: Client, groupId: number){
    return this._http.post(this.basicUri + "/secure/contact/"+groupId, contact);
  }

  public saveClients(file: File){
    let formData: FormData = new FormData();    
    formData.append("file", file, file.name);
    return this._http.post(this.basicUri + "/secure/contacts", formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public saveContactsToGroup(file: File, groupId: number){
    let formData: FormData = new FormData();    
    formData.append("file", file, file.name);
    return this._http.post(this.basicUri + "/secure/contacts/"+groupId, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  public removeContactFromGroup(contactId: number, groupId: number){
    let requestParams = "ContactId="+contactId+"&GroupId="+groupId;
    return this._http.post(this.basicUri + "/secure/contact/remove", requestParams, this.header);
  }

  public contactExists(code: string, phone: string){
    return this._http.get(this.basicUri + "/secure/contact/"+code+"/"+phone);
  }

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
    let rwfAirContacts = contacts.rwfAir;
    let kesContacts = contacts.kes;
    let kesAirContacts = contacts.kesAir;
    let tzsContacts = contacts.tzs;
    let tzsAirContacts = contacts.tzsAir;
    let ugxContacts = contacts.ugx;
    let ugxAirContacts = contacts.ugxAir;
    let otherContacts = contacts.other;

    return rwfContacts+rwfAirContacts+
          kesContacts+kesAirContacts+
          tzsContacts+tzsAirContacts+
          ugxContacts+ugxAirContacts+
          otherContacts;
  }

  public calculateCharges(charges: Charges, contacts: Contacts): number{
    let rwfCharges = charges.rwf;
    let rwfAirCharges = charges.rwfAir;
    let kesCharges = charges.kes;
    let kesAirCharges = charges.kesAir;
    let tzsCharges = charges.tzs;
    let tzsAirCharges = charges.tzsAir;
    let ugxCharges = charges.ugx;
    let ugxAirCharges = charges.ugxAir;
    let otherCharges = charges.other;

    return (rwfCharges * contacts.rwf) +
      (rwfAirCharges * contacts.rwfAir) +
      (kesCharges * contacts.kes) +
      (kesAirCharges * contacts.kesAir) +
      (tzsCharges * contacts.tzs) +
      (tzsAirCharges * contacts.tzsAir) +
      (ugxCharges * contacts.ugx) +
      (ugxAirCharges * contacts.ugx) +
      (otherCharges * contacts.other);
  }
}
