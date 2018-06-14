import { Credentials } from "./credentials.model";
import { User } from "./user.model";

export class UserCredentials extends User{
    credentials: Credentials;
}
