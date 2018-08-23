import { NgModule } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

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
  MatSelectModule,
  MatProgressBarModule,
  MatListModule,
  MatDialogModule,
  MatProgressSpinnerModule,



} from '@angular/material';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatMomentDateModule } from '@angular/material-moment-adapter';

import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
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
    MatButtonToggleModule,
    MatSelectModule,
    MatProgressBarModule,
    MatTabsModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSlideToggleModule
  ]


})
export class AngularMaterialModule {

}
