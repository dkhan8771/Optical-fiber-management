import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {

  public userDetails: any;
  public themeBGColor: any;
  public userName: any;

  constructor() { 
    this.userName = sessionStorage.getItem('username')
  }
  get username(){
    return sessionStorage.getItem('username')
  }
}
