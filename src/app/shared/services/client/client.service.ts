import { Injectable } from '@angular/core';
import { ClientTeleco } from '../../models/client-teleco.model';
import { GroupManagerService } from '../group/group-manager.service';

@Injectable()
export class ClientService {

  clients: ClientTeleco[] = [];

  constructor(private _groupManager: GroupManagerService) { }

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
