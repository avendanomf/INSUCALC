import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculoChoComponent } from './pages/calculo-cho/calculo-cho.component';
import { ConteoChoRoutingModule } from './conteo-cho-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegistroAlimentosComponent } from 'src/app/components/registro-alimentos/registro-alimentos.component';
import { HttpClientModule } from '@angular/common/http';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { MainPageModule } from 'src/app/pages/main/main.module';

@NgModule({
  declarations: [
    CalculoChoComponent,
    RegistroAlimentosComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ConteoChoRoutingModule,
    NgbModule,
    HttpClientModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    SharedModule,
    MainPageModule

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
})
export class ConteoChoModule { }
