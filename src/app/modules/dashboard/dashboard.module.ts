import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SampleGraphComponent } from './sample-graph/sample-graph.component';
import { ChartModule } from 'primeng/chart';
import { SampleFieldsComponent } from './sample-fields/sample-fields.component';
import { ToastModule } from 'primeng/toast';
import { DashboardContainerComponent } from './dashboard-container/dashboard-container.component';


@NgModule({
  declarations: [
    SampleGraphComponent,
    SampleFieldsComponent,
    DashboardContainerComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartModule,
    ToastModule,
    ButtonModule
  ],
  providers: [MessageService]
})
export class DashboardModule { }
