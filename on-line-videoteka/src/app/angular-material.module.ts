import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatInputModule,
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatGridListModule,
  MatPaginatorModule,
  MatButtonToggleModule,

} from '@angular/material';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatMomentDateModule } from '@angular/material-moment-adapter';




@NgModule({
  exports: [
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatExpansionModule,
    MatChipsModule,
    MatGridListModule,
    MatPaginatorModule,
    MatButtonToggleModule
  ]
})
export class AngularMaterialModule {

}
