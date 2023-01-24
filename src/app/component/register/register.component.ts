import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = { login: '', password: '', listesId: []};
  error: boolean = false;

  constructor(private userService: UserService, private router: Router) {
  }

  submit():void {
    this.userService.register(this.user).subscribe({
      next: () => { this.router.navigate(['']) },
      error: () => { this.error = true; }
    });
  }
}
