import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { observable } from 'rxjs';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { ROLE } from 'src/app/shared/services/constant/role.constant';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForn!: FormGroup;
  public user: any;


  constructor(
    private formBuilder: FormBuilder,
    private accountSewrvice: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.logFormInit()

  }

  logFormInit(): void {
    this.loginForn = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  login(): void {
    this.accountSewrvice.login(this.loginForn.value).subscribe((data) => {
      if (data && data.length > 0) {
        this.user = data[0]
        localStorage.setItem('login', JSON.stringify(this.user))
        this.accountSewrvice.isUserLogin$.next(true)
        this.actuve()
      }
    })
  }
  actuve() {
    if (this.user && this.user.role === ROLE.USER) {
      this.router.navigate(['/user-cabinet']);
    } else if (this.user && this.user.role === ROLE.ADMIN) {
      this.router.navigate(['/admin']);
    }
  }
}






