import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorNotification, catchError } from 'rxjs';
import { SuccessfulLogin } from 'src/app/shared/models/serverData';
import { IUserLogin } from 'src/app/shared/models/user';
import {
  ISavedData,
  clearStorage,
  saveToStorage,
} from 'src/app/shared/helpers/lockalStorage';
import { LOGIN_URL, LOGOUT_URL, USER } from 'src/app/shared/constants';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { chekIsLogin } from 'src/app/shared/helpers/isLogin';
import { GlobalElement } from '../../services/global';
import { getHeaders } from 'src/app/shared/helpers/prepareHeaders';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  public lockBtn = false;
  public serverAns: SuccessfulLogin | undefined;
  public isLogin: boolean | undefined;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    private global: GlobalElement
  ) {}

  ngOnInit() {
    this.global.isLogin.subscribe((val) => (this.isLogin = val));
    this.global.isLogin.next(chekIsLogin());
  }

  logOut() {
    this.http
      .delete(LOGOUT_URL, {
        headers: getHeaders(),
        observe: 'response',
      })
      .pipe(
        catchError(async (err: ErrorNotification) => {
          this.openSnackBarErr('Somsing vent wrong. Please try again');
        })
      )
      .subscribe((data) => {
        if (data?.ok) {
          this.isLogin = false;
          clearStorage();
          this.openSnackBarErr('Logout success');
          this.global.isLogin.next(false);
          this.router.navigate(['/signin']);
        }
      });
  }

  async onSubmit() {
    const user: IUserLogin = {
      email: this.loginForm.value.email?.toLowerCase() || '',
      password: this.loginForm.value.password || '',
    };

    this.lockBtn = true;

    this.http
      .post<SuccessfulLogin>(LOGIN_URL, user, {
        observe: 'body',
      })
      .pipe(
        catchError(async (err: ErrorNotification) => {
          let message =
            'Somsing wrong! Please enter correct email and password';
          if (err.error.type === 'NotFoundException')
            message = "Email and/or password doesn't exist in the system.";
          this.serverAns = undefined;
          this.lockBtn = false;
          this.openSnackBarErr(message);
          this.loginForm.reset();
        })
      )
      .subscribe(async (data: void | SuccessfulLogin) => {
        if (!data) return;
        this.serverAns = data;
        this.lockBtn = false;
        this.openSnackBarSucces();
        const toSaveData: ISavedData = {
          token: data.token,
          uid: data.uid,
          email: user.email,
        };

        saveToStorage(toSaveData);
        this.global.isLogin.next(true);
      });
  }

  openSnackBarErr(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  openSnackBarSucces() {
    this._snackBar
      .open('Welcome', 'Ok', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      })
      .afterDismissed()
      .subscribe(() => this.router.navigate(['main']));
  }
}
