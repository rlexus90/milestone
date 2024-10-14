import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorNotification, catchError, retry } from 'rxjs';
import { PROFILE_URL } from 'src/app/shared/constants';
import {
  ILoadData,
  loadFromStorage,
  loadProfile,
  saveProfile,
} from 'src/app/shared/helpers/lockalStorage';
import { getHeaders } from 'src/app/shared/helpers/prepareHeaders';
import { IProfile } from 'src/app/shared/models/serverData';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  private user: ILoadData;
  public profile: IProfile | undefined | null;
  public canEdit = false;
  public disabledBtn = false;
  public form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(40),
      Validators.pattern(/^[a-zA-Z\s]*$/),
    ]),
  });

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.user = loadFromStorage();
  }

  ngOnInit(): void {
    this.profile = loadProfile();
    this.form.get('name')?.disable();
    if (this.profile) {
      this.form.controls.name.setValue(this.profile.name.S);
      return;
    }
    this.http
      .get<IProfile>(PROFILE_URL, {
        headers: getHeaders(),
        observe: 'body',
      })
      .pipe(
        retry(3),
        catchError(async () => {
          this.openSnackBar('Somsing vent wrong try again');
        })
      )
      .subscribe((data) => {
        if (data) {
          saveProfile(data);
          this.profile = data;
          this.form.controls.name.setValue(this.profile.name.S);
        }
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  editBtnHandle() {
    this.canEdit = !this.canEdit;
    const nameInput = this.form.get('name');
    nameInput?.disabled ? nameInput.enable() : nameInput?.disable();
    nameInput?.setValue(this.profile?.name.S ?? '');
  }

  saveName() {
    const name = this.form.controls.name.value ?? '';

    if (this.form.invalid) {
      this.openSnackBar('Please enter correct Name');
      return;
    }

    if (name === this.profile?.name.S) {
      this.openSnackBar('Your name is equal previous');
      return;
    }
    this.disabledBtn = true;
    this.http
      .put(
        PROFILE_URL,
        {
          name,
        },
        {
          headers: getHeaders(),
          observe: 'response',
        }
      )
      .pipe(
        catchError(async (err: ErrorNotification) => {
          this.openSnackBar(
            'Somsing vent wrong. Please enter correct Name and try again'
          );
        })
      )
      .subscribe((data) => {
        if (data?.ok) {
          this.disabledBtn = false;
          if (!this.profile) return;
          this.profile.name.S = name;
          saveProfile(this.profile);
          this.editBtnHandle();
          this.openSnackBar(' Your name updated');
        }
      });
  }
}
