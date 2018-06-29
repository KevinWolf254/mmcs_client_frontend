import { Injectable } from '@angular/core';

@Injectable()
export class SignInService {
  
  private admin = {email:"admin@aeon-tech.co.ke", password: "admin123", role: "admin"};
  private user = {email:"user@aeon-tech.co.ke", password: "user123", role: "user"};

  constructor() { }

  sigin(email: string, password: string): string{
    let role: string = '';
    if(email == this.admin.email && password == this.admin.password){
      role = this.admin.role;
    }else if(email == this.user.email && password == this.user.password){
      role = this.user.role;
    }
    return role;
  }

}
