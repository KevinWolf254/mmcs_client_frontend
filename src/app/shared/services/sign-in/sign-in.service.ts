import { Injectable } from '@angular/core';
import { UserDetails } from '../../models/user-details.model';

@Injectable()
export class SignInService {
  
  private admin = {email:"admin@aeon-tech.co.ke", password: "admin123", role: "admin"};
  private user = {email:"user@aeon-tech.co.ke", password: "user123", role: "user"};

  userDetails: UserDetails;

  constructor() { }

  sigin(email: string, password: string): UserDetails{
    let role: string = '';
    if(email == this.admin.email && password == this.admin.password){
      this.userDetails = new UserDetails(1, 'John', 'Doe', 'admin@aeon-tech.co.ke', 'admin', true, '2018-06-30', 'aeon-tech');
    }else if(email == this.user.email && password == this.user.password){
      this.userDetails = new UserDetails(2, 'Jane', 'Doe', 'user@aeon-tech.co.ke', 'user', true, '2018-06-30', 'aeon-tech');
    }
    return this.userDetails;
  }

  getUserDetails(): UserDetails{
    return this.userDetails;
  }
}
