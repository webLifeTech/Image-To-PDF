import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PdfCreatePageRoutingModule } from './pdf-create-routing.module';

import { PdfCreatePage } from './pdf-create.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PdfCreatePageRoutingModule
  ],
  declarations: [PdfCreatePage]
})
export class PdfCreatePageModule {}
