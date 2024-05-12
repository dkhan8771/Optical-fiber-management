import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-sample-fields',
  templateUrl: './sample-fields.component.html',
  styleUrls: ['./sample-fields.component.scss']
})
export class SampleFieldsComponent {

  constructor(private messageService: MessageService) {}

  showSticky() {
      this.messageService.add({ severity: 'info', summary: 'Sticky', detail: 'Message Content', sticky: true });
  }

  onReject() {

  }

  onConfirm() {

  }

  showConfirm() {

  }

}
