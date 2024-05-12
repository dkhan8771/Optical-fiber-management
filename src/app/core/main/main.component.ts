import { CoreService } from './../services/core.service';
import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  public isToggle: any;
  public themeColor: any;

  constructor(private coreService: CoreService) {
    this.themeColor = this.coreService.themeBGColor;
  }

  public sidenavToggle(isToggle: any): void {
    this.isToggle = !isToggle;
  }

}
