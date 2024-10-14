import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-greate-group',
  templateUrl: './dialog-greate-group.component.html',
  styleUrls: ['./dialog-greate-group.component.scss'],
})
export class DialogGreateGroupComponent {
  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern(/^[a-zA-Z\s\d]*$/),
    ]),
  });

  constructor(public dialogRef: MatDialogRef<DialogGreateGroupComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
