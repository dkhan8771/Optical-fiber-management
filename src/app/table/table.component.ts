import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { MapDataService } from '../modules/map/services/map-data.service';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  placeName: any;
  toLocation: any;
  tableData = [];
  constructor(
    private ref: DynamicDialogConfig,
    private msgService: MessageService,
    private mapService: MapDataService
  ) {}
  ngOnInit(): void {
    this.placeName = this.mapService.placeName;
    this.toLocation = this.mapService.toLocation;

    if (!this.ref.data) {
      this.msgService.add({
        severity: 'warning',
        summary: 'No Reference Data Available',
      });
    }
    console.log(this.ref.data);
    this.mapService.getFiberData(this.ref.data).subscribe(
      (data: any) => {
        this.tableData = data.properties;
      },
      (err) => {
        if (err.status === 404) {
          this.msgService.add({
            severity: 'error',
            summary: 'Data Not Found !',
          });
        }
      }
    );
  }
}
