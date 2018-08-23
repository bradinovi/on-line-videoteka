import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '../../../../../node_modules/@angular/material';

@Component({
  templateUrl: './full-bio.component.html',
  styleUrls: ['./full-bio.component.css']
})
export class FullBioComponent implements OnInit {


  constructor(@Inject(MAT_DIALOG_DATA) public data: { bio: string}) { }

  ngOnInit() {
  }

}
