import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LOCALE_ID, NgModule} from '@angular/core';

import {appRoutingModule} from './app.routing';
import {AppComponent} from './app.component';
import {NavComponent} from './nav/nav.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {StoreComponent} from './store/store.component';
import {ConfigComponent} from './config/config.component';
import {ModelComponent} from './model/model.component';
import {LoginComponent} from './login/login.component';
import {AeroComponent} from './aero/aero.component';
import {VideoComponent} from './video/video.component';
import {ReportComponent} from './report/report.component';

import {registerLocaleData} from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {DataService} from './data.service';
import {NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import {HttpService} from './services/http.service';
import {HttpClientModule} from '@angular/common/http';
import {AuthGuard} from './services/auth-guard.service';
import {RoleGuard} from './services/role-guard.service';
import {CryptService} from './services/crypt.service';
import {AuthService} from './services/auth.service';
import {UiInfobarLeftComponent} from './model/ui/ui-infobar-left.component';
import {MainModelComponent} from './model/main-model/main-model.component';
import {ModelService} from './model/model.service';
import {SubModelComponent} from './model/sub-model/sub-model.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {ContextMenuModule} from 'ngx-contextmenu';

// the second parameter 'ru' is optional
registerLocaleData(localeRu, 'ru');

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    SidebarComponent,
    DashboardComponent,
    StoreComponent,
    ConfigComponent,
    ModelComponent,
    LoginComponent,
    AeroComponent,
    VideoComponent,
    ReportComponent,
    UiInfobarLeftComponent,
    MainModelComponent,
    SubModelComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        appRoutingModule,
        NgbNavModule,
        HttpClientModule,
        ReactiveFormsModule,
        CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory}),
        ContextMenuModule
    ],
  providers: [
    DataService,
    {provide: LOCALE_ID, useValue: 'ru'},
    HttpService,
    AuthGuard,
    RoleGuard,
    CryptService,
    AuthService,
    ModelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
