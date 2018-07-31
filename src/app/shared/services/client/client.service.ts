import { Injectable } from '@angular/core';
import { GroupManagerService } from '../group/group-manager.service';
import { Client } from '../../models/client.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ClientService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};
  private fileHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};
  clients: Client[] = [];

  constructor(private _http: HttpClient, private _groupManager: GroupManagerService) { }

  public createClient(client: Client){
    return this._http.post(this.basicUri + "/secure/client", client, this.authHeader);
  }

  public createClients(file: File){
    let formData: FormData = new FormData();    
    formData.append("file", file, file.name);
    return this._http.post(this.basicUri + "/secure/clients", formData, this.fileHeader);
  }

  findClientsByGroupId(groupId: number): Client[]{
    if(this._groupManager.findGroup(groupId) != null){ 
      let client: Client;     
      for(let i=1; i<=50; i++){
        client = new Client(i, '+254', 724000000 + i, 'Client '+i);
        this.clients.push(client);
      }
      return this.clients;
    }
    return [];
  }
}
