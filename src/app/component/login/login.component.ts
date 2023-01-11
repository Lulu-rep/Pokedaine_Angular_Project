import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error: boolean = false;
  user: User = { login: '', password: '' };

  constructor(private userService: UserService, private router: Router) {

  }

  submit():void {
      this.userService.login(this.user).subscribe({
        next: () => { this.router.navigate(['taches']) },
        error: () => { this.error = true; }
      });
  }

}
