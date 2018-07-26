import { Injectable } from '@angular/core';
import { ClientTeleco } from '../../models/client-teleco.model';
import { GroupManagerService } from '../group/group-manager.service';
import { Client } from '../../models/client.model';
import { HttpClient, HttpHeaders } from '../../../../../node_modules/@angular/common/http';

@Injectable()
export class ClientService {

  private basicUri: string = "http://localhost:8083/mmcs";
  private authHeader = {headers: new HttpHeaders({'Content-Type':'application/json'})};
  private fileHeader = {headers: new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded'})};


  clients: ClientTeleco[] = [];

  constructor(private _http: HttpClient, private _groupManager: GroupManagerService) { }

  public createClient(client: Client){
    return this._http.post(this.basicUri + "/secure/client", client, this.authHeader);
  }

  public createClients(file: File){
    let formData: FormData = new FormData();    
    formData.append("file", file, file.name);
    return this._http.post(this.basicUri + "/secure/clients", formData, this.fileHeader);
  }

  findClientsByGroupId(groupId: number): ClientTeleco[]{
    if(this._groupManager.findGroup(groupId) != null){ 
      let client: ClientTeleco;     
      for(let i=1; i<=50; i++){
        client = new ClientTeleco(i, '+254', 724000000 + i, 'Client '+i, "Safaricom-Ke");
        this.clients.push(client);
      }
      return this.clients;
    }
    return [];
  }
}
