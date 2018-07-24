export class Credentials {
    active: boolean;
    role: string;
    lastSignInDate: Date;
}

export enum Role{
  ADMIN = "ADMIN",
  USER = "USER"
}
