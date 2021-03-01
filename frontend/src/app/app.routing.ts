import {Routes, RouterModule} from '@angular/router';

import {DashboardComponent} from './dashboard/dashboard.component';
import {ModelComponent} from './model/model.component';
import {StoreComponent} from './store/store.component';
import {ConfigComponent} from './config/config.component';
import {AppComponent} from './app.component';
import {AeroComponent} from './aero/aero.component';
import {VideoComponent} from './video/video.component';
import {ReportComponent} from './report/report.component';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './services/auth-guard.service';
import {RoleGuard} from './services/role-guard.service';

// import { NotFoundComponent } from './not-found.component';

const routes: Routes = [

  {path: 'login', component: LoginComponent },
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'model', component: ModelComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'portalUser'}},
  {path: 'store', component: StoreComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'portalUser'}},
  {path: 'aero', component: AeroComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'portalUser'}},
  {path: 'config', component: ConfigComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'admin'}},
  {path: 'video', component: VideoComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'portalUser'}},
  {path: 'report', component: ReportComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'portalUser'}},

  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},

  // Иначе перенаправить на dashboard
  {path: '**', redirectTo: 'dashboard'}
];

export const appRoutingModule = RouterModule.forRoot(routes);
