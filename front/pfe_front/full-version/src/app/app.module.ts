import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CsvModule } from '@ctrl/ngx-csv';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { fakeBackendProvider } from 'app/auth/helpers'; // used to create fake backend
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { ContextMenuComponent } from 'app/main/extensions/context-menu/context-menu.component';
import { AnimatedCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component';
import { BasicCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component';
import { SubMenuCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component';
import { IncidentModule } from './main/incident/incident.module';
import {ProblemeModule} from "./main/probleme/probleme.module";
import {ChangementModule} from "./main/changement/changement.module";
import {UserModule} from "./main/user/user.module";
import {ActivateaccountModule} from "./main/activateaccount/activateaccount.module";
import {LoginModule} from "./main/login/login.module";
import {ForgotPasswordModule} from "./main/forgot-password/forgot-password.module";
import {AccountSettingsModule} from "./main/account-settings/account-settings.module";

const appRoutes: Routes = [

    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },

    {
    path: 'incident',
    loadChildren: () => import('./main/incident/incident.module').then(m => m.IncidentModule),
    canActivate: [AuthGuard]

  },
    {
    path: 'recoveracccount',
    loadChildren: () => import('./main/recoveraccount/recoveracccount.module').then(m => m.RecoveracccountModule),
  },
    {
    path: 'probleme',
    loadChildren: () => import('./main/probleme/probleme.module').then(m => m.ProblemeModule),
    canActivate: [AuthGuard]

  },
    {
    path: 'changement',
    loadChildren: () => import('./main/changement/changement.module').then(m => m.ChangementModule),
   canActivate: [AuthGuard]
  },
    {
    path: 'user',
    loadChildren: () => import('./main/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
    {
    path: 'login',
    loadChildren: () => import('./main/login/login.module').then(m => m.LoginModule)
  },
    {
    path: 'activate-account',
    loadChildren: () => import('./main/activateaccount/activateaccount.module').then(m => m.ActivateaccountModule)
  },
    {
        path: 'forgot-password',
        loadChildren: () => import('./main/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    },
    {
        path: 'settings',
        loadChildren: () => import('./main/account-settings/account-settings.module').then(m => m.AccountSettingsModule),
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./main/analytics/analytics.module').then(m => m.AnalyticsModule),
    },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
    declarations: [
        AppComponent,
        ContextMenuComponent,
        BasicCustomContextMenuComponent,
        AnimatedCustomContextMenuComponent,
        SubMenuCustomContextMenuComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
            delay: 0,
            passThruUnknownUrl: true
        }),
        RouterModule.forRoot(appRoutes, {
            scrollPositionRestoration: 'enabled',
            relativeLinkResolution: 'legacy'
        }),
        NgbModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        ContextMenuModule,
        CoreModule.forRoot(coreConfig),
        CoreCommonModule,
        CoreSidebarModule,
        CoreThemeCustomizerModule,
        CardSnippetModule,
        LayoutModule,
        ContentHeaderModule,
        CsvModule,
        NgxDatatableModule,
        ProblemeModule,
        ChangementModule,
        UserModule,
        ActivateaccountModule,
        LoginModule,
        IncidentModule,
        ForgotPasswordModule,
        AccountSettingsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
