import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PdfCreatePage } from './pdf-create.page';

const routes: Routes = [
  {
    path: '',
    component: PdfCreatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdfCreatePageRoutingModule {}
