import { CoreService } from './../services/core.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TopNavigationItem } from './top-navigation';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent {

  items: MenuItem[];
  @Output() toggleNav = new EventEmitter();
  private blnToggle: boolean = true;

  constructor(private topNavigation: TopNavigationItem, private router: Router, public coreService: CoreService) {
    this.items = topNavigation.get();
  }

  public logout(): void {
    this.router.navigateByUrl('')
  }

  public sidenavToggle(): void {
    this.blnToggle ? this.blnToggle = false : this.blnToggle = true;
    this.toggleNav.next(this.blnToggle);
  }

}
