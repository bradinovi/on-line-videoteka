import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';



import { NgForm } from '@angular/forms';


export interface Ocupation {
  name: string;
}


@Component({
  selector: 'app-actor-add',
  templateUrl: './actor-add.component.html',
  styleUrls: ['./actor-add.component.css']
})
export class ActorAddComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  ocupations: Ocupation[] = [];

  constructor() { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;


    if ((value || '').trim()) {
      this.ocupations.push({name: value.trim()});
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(ocupation: Ocupation): void {
    const index = this.ocupations.indexOf(ocupation);

    if (index >= 0) {
      this.ocupations.splice(index, 1);
    }
  }
}
