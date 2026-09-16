import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import {ProblemeComponent} from "./admin/probleme.component";
import {ProblemeManagerComponent} from "./manager/problememanager.component";
import {AuthGuard} from "../../auth/helpers";
import { NgSelectModule } from '@ng-select/ng-select';
import {ProblemeworkerComponent} from "./worker/problemeworker.component";
import {ViewproblemComponent} from "./viewProblem/viewproblem.component";
import {CoreSidebarModule} from "../../../@core/components";
import {ArchivedProblemsComponent} from "./archivedProblems/archivedProblems.component";


const routes: Routes = [
  {
    path: 'probleme/admin',
    component: ProblemeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'probleme/manager',
    component: ProblemeManagerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['MANAGER'] }
  },
  {
    path: 'probleme/worker',
    component: ProblemeworkerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['WORKER'] }
  },
  {
    path: 'probleme/:id',
    component: ViewproblemComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN','MANAGER','WORKER'] }
  },
  {
    path: 'probleme-archived',
    component: ArchivedProblemsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN','MANAGER','WORKER'] }
  }
];

@NgModule({
  declarations: [ProblemeComponent,ProblemeManagerComponent,ProblemeworkerComponent,ViewproblemComponent,ArchivedProblemsComponent],
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
    CoreSidebarModule,
  ],
  providers: []
})
export class ProblemeModule {}
