import { NgModule } from '@angular/core';
import { ActorAddComponent } from './actor-add/actor-add.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ ActorAddComponent ],
  imports: [
    ReactiveFormsModule
  ],
  exports: [
    ActorAddComponent
  ]
})
export class ActorsModule {

}
