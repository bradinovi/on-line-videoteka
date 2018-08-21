import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RentService } from '../../services/rents.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rent-dialog',
  templateUrl: './rent-dialog.component.html',
  styleUrls: ['./rent-dialog.component.css']
})
export class RentDialogComponent implements OnInit {
  exists = false;
  rentId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { movieId: string, posterPath: string, title: string },
    public dialogRef: MatDialogRef<RentDialogComponent>, private rentService: RentService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onCancel() {
    this.dialogRef.close();
  }

  onConfirm(duration) {
    console.log(duration);
    if (!this.exists) {
      this.rentService.rentMovie(this.data.movieId, duration).subscribe(
        (rentData) => {
          if (rentData.rentId) {
            console.log(rentData.rentId);
            this.rentId = rentData.rentId;
            this.exists = true;
          } else {
            this.router.navigate(['/mymovies']);
            this.dialogRef.close();
          }
        }
      );
    } else {
      this.rentService.extendRent(this.rentId, duration).subscribe(
        rentExtendData => {
          console.log(rentExtendData);
          this.router.navigate(['/mymovies']);
            this.dialogRef.close();
        }
      );
    }

  }

}
