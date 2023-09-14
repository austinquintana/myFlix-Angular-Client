import { Component, Input, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

type User = { _id?: string, Username?: string, Password?: string, Email?: string, FavoriteMovies?: [] }

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  user: User = {};
  favoriteMovies: any[] = [];

  @Input() userData = { Username: '', Password: '', Email: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
    const user = this.getUser();

    if (!user._id) {
      this.router.navigate(['welcome']);
      return;
    }

    this.user = user;
    this.userData = {
      Username: user.Username || "",
      Email: user.Email || "",
      Password: ""
    };

    this.getFavoriteMovies();
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe((result) => {
      localStorage.setItem('user', JSON.stringify(result))
      this.user = result;
      this.snackBar.open('User updated!', 'OK', {
        duration: 2000
      })
    })
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      this.fetchApiData.deleteUser().subscribe(() => {
        localStorage.clear();
        this.router.navigate(['welcome']);
      });
    }
  }

  getFavoriteMovies(): void {
    this.fetchApiData.getFavoriteMovies(this.user.Username || '').subscribe((movies: any) => {
      this.favoriteMovies = movies;
    });
  }
}









