import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ErrorNotification, catchError } from 'rxjs';
import { REGISTERATION_URL } from 'src/app/shared/constants';
import { IUser } from 'src/app/shared/models/user';
import { GlobalElement } from '../../services/global';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z\s]*$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Z]/),
      Validators.pattern(/[a-z]/),
      Validators.pattern(/\d/),
      Validators.pattern(/[!@#$%^&*]/),
      Validators.minLength(8),
    ]),
  });

  public lockBtn = false;

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    public global: GlobalElement
  ) {}

  onSubmit(): void {
    console.log(this.registrationForm);
    const user: IUser = {
      email: this.registrationForm.value.email?.toLowerCase() || '',
      password: this.registrationForm.value.password || '',
      name: this.registrationForm.value.name || '',
    };

    this.lockBtn = true;

    this.http
      .post(REGISTERATION_URL, user, { observe: 'response' })
      .pipe(
        catchError(async (err: ErrorNotification) => {
          let message =
            'Somsing wrong! Please enter correct name, email and password';
          if (err.error.type === 'PrimaryDuplicationException') {
            message = `User ${user.email} already exists`;
            this.global.setEmailList(user.email);
          }
          this.lockBtn = false;
          this.openSnackBarErr(message);
        })
      )
      .subscribe(async (data) => {
        if (!data) return;
        this.lockBtn = false;
        this.openSnackBarSucces();
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
      .open(
        'Нou have successfully registered. Now log in to your entire account',
        'Sign In',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
        }
      )
      .afterDismissed()
      .subscribe(() => this.router.navigate(['signin']));
  }
}
