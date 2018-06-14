import { Group } from "./group.model";

export class Sms {
    message: string;
    groups: number[];

    constructor(message: string, groups: number[]){
        this.message = message;
        this.groups = groups;
    }

}
