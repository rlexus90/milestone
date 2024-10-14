import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, catchError, retry } from 'rxjs';
import { GlobalElement } from '../../services/global';
import { IMessages } from 'src/app/shared/models/messages';
import { IMessagesResp } from 'src/app/shared/models/serverData';
import {
  CONVERS_DELETE,
  CONVERS_MSG,
  CONVERS_MSG_SEND,
} from 'src/app/shared/constants';
import { getHeaders } from 'src/app/shared/helpers/prepareHeaders';
import { loadFromStorage } from 'src/app/shared/helpers/lockalStorage';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent implements OnInit, OnDestroy {
  public id: string | undefined;
  private sub!: Subscription;
  public timer: number | undefined;
  public messages: IMessages[] = [];
  public text: string = '';

  constructor(
    private route: ActivatedRoute,
    private global: GlobalElement,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(
      (params) => (this.id = params['id'])
    );
    this.global.timerConversDialog.subscribe((val) => (this.timer = val));
    this.loadDialog();
  }

  updateDialog() {
    this.global.timerUpdateConverDialog();
    this.loadDialog();
  }

  loadDialog() {
    this.http
      .get<IMessagesResp>(CONVERS_MSG + `${this.id}`, {
        headers: getHeaders(),
        observe: 'body',
      })
      .pipe(
        retry(1),
        catchError(async (e) => {
          if (e.error.type == 'InvalidIDException') {
            this.deleteConvers();
          }
          this.openSnackBar('Somesing went wrong try again');
        })
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
        CONVERS_MSG_SEND,
        { conversationID: this.id, message: this.text },
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

  deleteConvers() {
    this.http
      .delete(CONVERS_DELETE + `${this.id}`, {
        headers: getHeaders(),
        observe: 'response',
      })
      .pipe(
        retry(1),
        catchError(async (e) => {
          if (e.error.type == 'InvalidIDException') {
            this.openSnackBar(
              'This conversation was deleted before. Please try delete conversation again.'
            );
          }
          this.openSnackBar('Somesing went wrong try again');
        })
      )
      .subscribe((data) => {
        if (!data) return this.openSnackBar('Somesing went wrong try again');
        if (data.ok) {
          this.router.navigate(['main']);
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
