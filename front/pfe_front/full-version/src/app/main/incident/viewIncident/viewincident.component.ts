import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IncidentService } from '../../../services/incident.service';
import { Incident } from '../../../../models/incident.model';

@Component({
  selector: 'app-incidentmanager',
  templateUrl: './viewincident.component.html',
  styleUrls: ['./viewincident.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewincidentComponent implements OnInit {
  public incident: Incident;

  constructor(
      private incidentService: IncidentService,
      private route: ActivatedRoute
  ) {}

  loadIncidents(id: number): void {
    this.incidentService.findIncidentById(id).subscribe((data: Incident) => {
      this.incident = data;
    });
  }
  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
  ngOnInit() {
      this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadIncidents(id);
    });
  }


  downloadFile(filename): void {

    this.incidentService.downloadFile(filename).subscribe(
        (response: Blob) => {
          const blobUrl = window.URL.createObjectURL(response);

          const anchor = document.createElement('a');
          anchor.href = blobUrl;
          anchor.download = filename;
          anchor.click();

          window.URL.revokeObjectURL(blobUrl);
        },
        (error) => {
          console.error('Error occurred while downloading file', error);
        }
    );
  }
}