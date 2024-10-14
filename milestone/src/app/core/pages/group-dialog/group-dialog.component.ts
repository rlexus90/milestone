import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, retry } from 'rxjs';
import { GlobalElement } from '../../services/global';

import { HttpClient } from '@angular/common/http';
import { IMessagesResp } from 'src/app/shared/models/serverData';
import { GROUP_MESSAGES_URL, GROUP_SEND_MSG } from 'src/app/shared/constants';
import { getHeaders } from 'src/app/shared/helpers/prepareHeaders';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMessages } from 'src/app/shared/models/messages';
import { loadFromStorage } from 'src/app/shared/helpers/lockalStorage';

@Component({
  selector: 'app-group-dialog',
  templateUrl: './group-dialog.component.html',
  styleUrls: ['./group-dialog.component.scss'],
})
export class GroupDialogComponent implements OnInit, OnDestroy {
  public id: string | undefined;
  private sub!: Subscription;
  public timer: number | undefined;
  public text: string = '';
  public messages: IMessages[] = [];

  constructor(
    private route: ActivatedRoute,
    private global: GlobalElement,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(
      (params) => (this.id = params['id'])
    );
    this.global.timerGroupeDialog.subscribe((val) => (this.timer = val));
    this.loadDialog();
  }

  updateDialog() {
    this.global.timerUpdateGroupDialog();
    this.loadDialog();
  }

  loadDialog() {
    this.http
      .get<IMessagesResp>(GROUP_MESSAGES_URL + `${this.id}`, {
        headers: getHeaders(),
        observe: 'body',
      })
      .pipe(
        retry(1),
        catchError(async () =>
          this.openSnackBar('Somesing went wrong try again')
        )
      )
      .subscribe((data) => {
        if (data) {
          let flag = true;
          const messages: IMessages[] = data.Items.map((el, ind) => {
            if (ind === 0)
              return {
                leftSide: flag,
                authorID: el.authorID.S,
                message: el.message.S,
                createdAt: el.createdAt.S,
              };

            if (el.authorID.S === data.Items[ind - 1].authorID.S)
              return {
                authorID: el.authorID.S,
                message: el.message.S,
                createdAt: el.createdAt.S,
                leftSide: flag,
              };
            flag = !flag;

            return {
              authorID: el.authorID.S,
              message: el.message.S,
              createdAt: el.createdAt.S,
              leftSide: flag,
            };
          });
          this.messages = messages;
        }
      });
  }

  sendMessage() {
    this.http
      .post(
        GROUP_SEND_MSG,
        { groupID: this.id, message: this.text },
        {
          headers: getHeaders(),
          observe: 'response',
        }
      )
      .pipe(
        retry(1),
        catchError(async () =>
          this.openSnackBar('Somesing went wrong try again')
        )
      )
      .subscribe((data) => {
        if (!data) return this.openSnackBar('Somesing went wrong try again');
        if (data.ok) {
          this.messages.push({
            authorID: loadFromStorage().uid ?? '',
            message: this.text,
            createdAt: Date.now() + '',
            leftSide: false,
          });
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
