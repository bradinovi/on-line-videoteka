import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';



import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActorService } from '../actors.service';


export interface Ocupation {
  name: string;
}


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
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  ocupations: string[] = [];

  constructor(public actorsService: ActorService) { }

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
    console.log(this.form);
    console.log(this.ocupations);
    this.actorsService.addActor(this.form.value.firstName, this.form.value.lastName, this.form.value.born.toISOString(),
    this.form.value.died.toISOString(), this.ocupations, this.form.value.bio, this.form.value.image);
    return;
  }

  clearImage() {
    this.imagePreview = '';
  }
}
