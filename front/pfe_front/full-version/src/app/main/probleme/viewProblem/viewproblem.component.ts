import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProblemeService } from '../../../services/problem.service';
import { Probleme } from '../../../../models/probleme.model';
import { CoreTranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-problememanager',
  templateUrl: './viewproblem.component.html',
  styleUrls: ['./viewproblem.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewproblemComponent implements OnInit {
  public problem: Probleme;

  constructor(
      private problemeService: ProblemeService,
      private route: ActivatedRoute
  ) {}

  loadProblems(id: number): void {
    this.problemeService.findProblemeById(id).subscribe((data: Probleme) => {
      this.problem = data;
    });
  }
  formatDate(date: string | Date): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadProblems(id);
    });
  }

  downloadFile(filename): void {

    this.problemeService.downloadFile(filename).subscribe(
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