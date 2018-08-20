import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { MovieService } from '../../../services/movie.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-movie-delete-dialog',
  templateUrl: './movie-delete-dialog.component.html',
  styleUrls: ['./movie-delete-dialog.component.css']
})
export class MovieDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string},
  public dialogRef: MatDialogRef<MovieDeleteDialogComponent>,
  private router: Router, private movieService: MovieService) { }

  ngOnInit() {
  }

  onNo() {
    this.dialogRef.close();
  }

  onYes() {
    this.movieService.deleteMovie(this.data.id).subscribe(
      (res) => {
        console.log(res);
        this.router.navigate(['/searchpage']);
        this.dialogRef.close();
      }
    );

  }

}
