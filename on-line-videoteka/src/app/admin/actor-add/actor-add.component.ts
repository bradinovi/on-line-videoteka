import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActorService } from '../../services/actors.service';
import { ActivatedRoute, ParamMap } from '../../../../node_modules/@angular/router';
import { Actor } from '../../models/actor.model';
import { Moment } from '../../../../node_modules/moment';

@Component({
  selector: 'app-actor-add',
  templateUrl: './actor-add.component.html',
  styleUrls: ['./actor-add.component.css']
})
export class ActorAddComponent implements OnInit {
  isLoading = false;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  imagePreview: string;
  form: FormGroup;
  actor: Actor;

  private actorId: string;
  private mode = 'create';
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  ocupations: string[] = [];

  constructor(public actorsService: ActorService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.imagePreview = '';
    this.form = new FormGroup({
      'firstName': new FormControl(null, { validators: [Validators.required] }),
      'lastName': new FormControl(null, { validators: [Validators.required] }),
      'born': new FormControl(null),
      'died': new FormControl(null),
      'bio': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null),
        });
    this.checkAndPrepareUpdate();
  }

  private checkAndPrepareUpdate() {
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('id')) {
        this.mode = 'update';
        this.actorId = param.get('id');
        this.isLoading = true;
        this.actorsService.getActor(this.actorId).subscribe((actorData) => {
          console.log(actorData);
          this.actor = {
            id: actorData._id,
            firstName: actorData.firstName,
            lastName: actorData.lastName,
            ocupations: actorData.ocupations,
            born: actorData.born,
            died: actorData.died,
            bio: actorData.bio,
            portraitPath: actorData.portraitPath,
            roles: actorData.roles,
            directed: actorData.directed
          };
          let imagePath = this.actor.portraitPath;
          if ( !imagePath ) {
            imagePath = '/';
          }
          this.form.setValue({
            firstName: this.actor.firstName,
            lastName: this.actor.lastName,
            born: this.actor.born,
            died: this.actor.died,
            bio: this.actor.bio,
            image: imagePath
          });

          this.ocupations = this.actor.ocupations;
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.actorId = null;
      }
    });
  }

  add(event: MatChipInputEvent): void {

    const input = event.input;
    const value = event.value;


    if ((value || '').trim()) {
      this.ocupations.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(ocupation: string): void {
    const index = this.ocupations.indexOf(ocupation);

    if (index >= 0) {
      this.ocupations.splice(index, 1);
    }
  }

  onImageChosen(event: Event) {
    console.log('a');
    const file = (event.target as HTMLInputElement).files[0]; // this stores a file object
    this.form.value.image = event.target;
    this.form.patchValue({'image': file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
            this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSaveActor() {
    this.isLoading = true;
    if (this.mode === 'create') {
      this.actorsService.addActor(
      this.form.value.firstName, this.form.value.lastName,
      this.dateString( this.form.value.born),
      this.dateString( this.form.value.died),
      this.ocupations, this.form.value.bio, this.form.value.image);
    } else {
      this.actorsService.updateActor(
        this.actorId, this.form.value.firstName, this.form.value.lastName,
        this.dateString( this.form.value.born),
        this.dateString( this.form.value.died),
        this.ocupations, this.form.value.bio, this.form.value.image, this.actor.roles, this.actor.directed
      );
    }
    this.form.reset();
    return;
  }

  clearImage() {
    this.imagePreview = '';
  }

  dateString(date: string | Moment) {
    if ( date === null) {
      return '';
    }
    if (typeof(date) === 'object') {
      return date.toISOString();
    }
    return date;
  }

}
