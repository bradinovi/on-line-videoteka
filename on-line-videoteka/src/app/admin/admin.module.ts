import { NgModule } from '@angular/core';
import { ActorAddComponent } from './actor-add/actor-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MovieAddComponent } from './movie-add/movie-add.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AngularMaterialModule } from '../angular-material.module';
import { CommonModule } from '../../../node_modules/@angular/common';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '../../../node_modules/@angular/material';
import { MomentDateAdapter } from '../../../node_modules/@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.gggg'
  },
  display: {
    dateInput: 'DD.MM.gggg',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD.MM.gggg',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    ActorAddComponent,
    MovieAddComponent
  ],
  imports: [
    ReactiveFormsModule,
    AdminRoutingModule,
    AngularMaterialModule,
    CommonModule,
    FormsModule
  ],

  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AdminModule {

}
