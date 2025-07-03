import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReporteCHORoutingModule } from './reporte-chorouting.module';
import { ListaChoComponent } from './pages/lista-cho/lista-cho.component';
import { SharedModule } from '../shared/shared.module';
import { RouteReuseStrategy } from '@angular/router';


@NgModule({
  declarations: [
    ListaChoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReporteCHORoutingModule,
    SharedModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }]
})
export class ReporteCHOModule { }

