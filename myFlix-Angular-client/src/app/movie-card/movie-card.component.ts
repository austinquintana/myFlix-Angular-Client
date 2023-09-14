import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieDetailDialogComponent } from '../movie-detail-dialog/movie-detail-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    const user = localStorage.getItem('user');

    if (!user) {
      this.router.navigate(['welcome']);
      return;
    }

    this.getMovies();
  }

  /**
   * calls the getAllMovies api and sets the value
   * @param id the movie id
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;

      return this.movies;
    });
  }

  openGenreDialog(genre: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: genre.Name,
        content: genre.Description,
      }
    })
  }

  openSynopsisDialog(synopsis: string): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: "Description",
        content: synopsis,
      }
    })
  }

  openDirectorDialog(director: any): void {
    this.dialog.open(MovieDetailDialogComponent, {
      data: {
        title: director.Name,
        content: director.Bio,
      }
    })
  }

  isFavorite(ID: string): boolean {
    return this.fetchApiData.isFavoriteMovie(ID)
  }

  /**
   * calls the deleteFavoriteMovie api and shows the snackbar if successful
   * @param ID the movie id
   */
  removeFavorite(ID: string): void {
    this.fetchApiData.deleteFavoriteMovie(ID).subscribe(
      () => {
        this.snackBar.open('Removed from favorites', 'OK', { duration: 2000 });
      },
      (error) => {
        console.error('Error while removing from favorites:', error);
        this.snackBar.open('Error occurred while removing from favorites', 'OK', { duration: 2000 });
      }
    );
  }
  
  addFavorite(ID: string): void {
    this.fetchApiData.addFavoriteMovie(ID).subscribe(
      () => {
        this.snackBar.open('Added to favorites', 'OK', { duration: 2000 });
      },
      (error) => {
        console.error('Error while adding to favorites:', error);
        this.snackBar.open('Error occurred while adding to favorites', 'OK', { duration: 2000 });
      }
    );
  }
}
