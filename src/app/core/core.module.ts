import { DividerModule } from 'primeng/divider';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { MainComponent } from './main/main.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { LoginComponent } from './login/login.component';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { TopNavigationComponent } from './top-navigation/top-navigation.component';
import { TopNavigationItem } from './top-navigation/top-navigation';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SideNavigationItem } from './side-navigation/side-navigation';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    MainComponent,
    SideNavigationComponent,
    LoginComponent,
    TopNavigationComponent
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    DividerModule,
    CardModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    MenubarModule,
    ToastModule,
    PanelMenuModule
  ],
  providers: [TopNavigationItem, SideNavigationItem]
})
export class CoreModule { }
