import { CoreService } from './../services/core.service';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { SideNavigationItem } from './side-navigation';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent {

  items: MenuItem[];

  constructor(private SideNavigationItem: SideNavigationItem, private coreService: CoreService) {
    this.items = SideNavigationItem.get();
    console.log("sssss", this.coreService.userDetails);

    if(this.coreService.userDetails && this.coreService.userDetails[0].type === 'user') {
      this.items = this.items.filter(x => x.routerLink !== 'users')
    }
  }

}
