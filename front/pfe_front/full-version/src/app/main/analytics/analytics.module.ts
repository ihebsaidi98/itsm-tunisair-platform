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
import {AuthGuard} from "../../auth/helpers";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {AnalyticsComponent} from "./analytics.component";

const routes: Routes = [

  {
    path: '',
    component: AnalyticsComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN','MANAGER']}
  }
];

@NgModule({
  declarations: [AnalyticsComponent],
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
export class AnalyticsModule {}
