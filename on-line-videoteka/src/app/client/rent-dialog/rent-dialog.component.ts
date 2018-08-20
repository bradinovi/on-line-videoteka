import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RentService } from '../../services/rents.service';

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrls: ['./rent-dialog.component.css']
})
export class RentDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: string, posterPath: string, title: string },
    public dialogRef: MatDialogRef<RentDialogComponent>, private rentService: RentService
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm(duration) {
    console.log(duration);
    this.rentService.rentMovie(this.data.movieId, duration);
    this.dialogRef.close();
  }

}
