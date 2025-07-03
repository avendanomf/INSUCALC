import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaChoComponent } from './pages/lista-cho/lista-cho.component';

const routes: Routes = [
  {
    path: '',
    component: ListaChoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReporteCHORoutingModule { }


