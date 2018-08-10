export class Employer {
    id: number;
    name: string;
    constructor(id?: number, name?: string){
        this.id = id;
        this.name = name; 
    }
}

export class EmployerRegistration extends Employer{
    enabled: boolean;
    constructor(id?: number, name?: string, enabled?: boolean){
        super(id, name);
        this.enabled = enabled;
    }
}

export enum Country{
    RWANDA, KENYA, TANZANIA, UGANDA
}