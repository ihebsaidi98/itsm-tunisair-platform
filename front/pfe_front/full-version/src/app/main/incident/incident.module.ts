import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import {AuthGuard} from "../../auth/helpers";
import { NgSelectModule } from '@ng-select/ng-select';
import {IncidentComponent} from "./admin/incident.component";
import {IncidentmanagerComponent} from "./manager/incidentmanager.component";
import {IncidentworkerComponent} from "./worker/incidentworker.component";
import {ViewincidentComponent} from "./viewIncident/viewincident.component";
import {ArchivedIncidentsComponent} from "./ArchivedIncidents/archivedIncidents.component";


const routes: Routes = [
  {
    path: 'incident/admin',
    component: IncidentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  }, {
    path: 'incident/manager',
    component: IncidentmanagerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MANAGER'] }
  }, {
    path: 'incident/worker',
    component: IncidentworkerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['WORKER'] }
  },
  {
    path: 'incident/:id',
    component: ViewincidentComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN','MANAGER','WORKER'] }
  },
  {
    path: 'incident-archived',
    component: ArchivedIncidentsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN','MANAGER','WORKER'] }
  }
];

@NgModule({
  declarations: [IncidentComponent,IncidentmanagerComponent,IncidentworkerComponent,ViewincidentComponent,ArchivedIncidentsComponent],
  imports: [
    RouterModule.forChild(routes),
    NgbModule,
    TranslateModule,
    CoreCommonModule,
    ContentHeaderModule,
    CardSnippetModule,
    NgxDatatableModule,
    CsvModule,
    NgSelectModule,
  ],
  providers: []
})
export class IncidentModule {}
