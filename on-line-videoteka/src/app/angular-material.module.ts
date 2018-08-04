import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatInputModule,
  MatIconModule
} from '@angular/material';

@NgModule({
  exports: [
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule
  ]
})
export class AngularMaterialModule {

}
