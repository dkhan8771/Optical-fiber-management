import { CoreService } from './../services/core.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  userList = [
    {
      userName: 'Admin',
      password: 'admin',
      type: 'admin',
      bgColor: '#fcfcfa'
    },
    {
      userName: 'User',
      password: 'user',
      type: 'user',
      bgColor: '#94c4d4'
    }
  ];

  public loginForm: FormGroup;
  public invalidLogin: boolean = false;

  constructor(private fb: FormBuilder, private coreService: CoreService, private router: Router) {
    this.loginForm = fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }

  public login(): void {
    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return
    }
    let authentication: any = this.userList.filter(x => x.userName === this.loginForm?.value.userName.userName && x.password === this.loginForm?.value.password);
    this.coreService.userDetails = authentication;
    this.coreService.themeBGColor = authentication[0].bgColor;
    this.coreService.userName = authentication[0].userName;
    sessionStorage.setItem('username',authentication[0].userName)
    if(authentication.length === 0){
      this.invalidLogin = true;
      return
    }
    this.router.navigateByUrl('landing');
  }

}
