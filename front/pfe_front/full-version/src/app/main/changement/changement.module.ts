import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CsvModule } from '@ctrl/ngx-csv';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { DatatablesService } from 'app/main/tables/datatables/datatables.service';
import {ChangementComponent} from "./admin/changement.component";
import {ChangementmanagerComponent} from "./manager/changementmanager.component";
import {AuthGuard} from "../../auth/helpers";
import {ChangementworkerComponent} from "./worker/changementworker.component";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";

const routes: Routes = [
  {
    path: 'changement/admin',
    component: ChangementComponent,
    resolve: {
      datatables: DatatablesService
    },
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN']}
  },
  {
    path: 'changement/manager',
    component: ChangementmanagerComponent,
    resolve: {
      datatables: DatatablesService
    },
    canActivate: [AuthGuard],
    data: { roles: ['MANAGER']}
  },
  {
    path: 'changement/worker',
    component: ChangementworkerComponent,
    resolve: {
      datatables: DatatablesService
    },
    canActivate: [AuthGuard],
    data: { roles: ['WORKER']}
  }
];

@NgModule({
  declarations: [ChangementComponent,ChangementmanagerComponent,ChangementworkerComponent],
    imports: [
        RouterModule.forChild(routes),
        NgbModule,
        TranslateModule,
        CoreCommonModule,
        ContentHeaderModule,
        CardSnippetModule,
        NgxDatatableModule,
        CsvModule,
        PerfectScrollbarModule
    ],
  providers: [DatatablesService]
})
export class ChangementModule {}
