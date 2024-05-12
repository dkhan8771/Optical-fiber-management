import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapRoutingModule } from './map-routing.module';
import { MapViewComponent } from './components/map-view/map-view.component';
import { HttpClientModule } from '@angular/common/http';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TabViewModule } from 'primeng/tabview';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ColorPickerModule } from 'primeng/colorpicker';
import { MessagesModule } from 'primeng/messages';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SliderModule } from 'primeng/slider';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { MessageService} from 'primeng/api';

@NgModule({
  declarations: [MapViewComponent],
  imports: [
    CommonModule,
    MapRoutingModule,
    ChartModule,
    FormsModule,
    HttpClientModule,
    InputSwitchModule,
    TabViewModule,
    DropdownModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    ButtonModule,
    ColorPickerModule,
    InputTextModule,
    InputNumberModule,
    SharedModule,
    SliderModule,
    MessagesModule,
    ToastModule,
    AccordionModule,
    AutoCompleteModule
  ],
  providers:[MessageService]
})
export class MapModule {}
