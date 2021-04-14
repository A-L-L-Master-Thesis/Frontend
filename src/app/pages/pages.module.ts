import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { ComponentsModule } from '../components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { AgmDrawingModule } from '@agm/drawing';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  declarations: [DashboardComponent, AdminComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ComponentsModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: environment.production? environment.api.apiKeys.googleMaps : '',
      libraries: ['places', 'drawing', 'geometry']
    }),
    AgmDrawingModule,
    AgmSnazzyInfoWindowModule
  ]
})
export class PagesModule { }
