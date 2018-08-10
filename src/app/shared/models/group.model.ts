export class Group {
    id: number;
    name: string;
    
    constructor(id?: number, name?: string){
        this.id = id;
        this.name = name;
    }
}

export class GroupedContactsRequest{
    groupIds: number[];

    constructor(groupIds: number[]){
        this.groupIds = groupIds;
    }
}
