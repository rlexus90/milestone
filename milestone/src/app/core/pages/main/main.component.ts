import { Component, OnInit } from '@angular/core';
import { GlobalElement } from '../../services/global';
import { HttpClient } from '@angular/common/http';
import {
  CONVERSATIONS_GREATE,
  CONVERSATIONS_LIST_URL,
  GROUP_DELETE,
  GROUP_GREATE,
  GROUP_URL,
  USER_LIST_URL,
} from 'src/app/shared/constants';
import { getHeaders } from 'src/app/shared/helpers/prepareHeaders';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, retry } from 'rxjs';
import {
  IConversations,
  IGroups,
  IOneUser,
  IUsers,
} from 'src/app/shared/models/serverData';
import { loadFromStorage } from 'src/app/shared/helpers/lockalStorage';
import { MatDialog } from '@angular/material/dialog';
import { DialogGreateGroupComponent } from 'src/app/shared/component/dialog-greate-group/dialog-greate-group.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  public time: number | undefined;
  public usersUpdTimer: number | undefined;
  public canUpdate: boolean = true;
  public groupsData: IGroups | undefined;
  public user = loadFromStorage();
  public name = '';
  public delCallback!: Function;

  public usersList: IUsers | undefined;
  public conversationsList: string[] | undefined;

  constructor(
    private global: GlobalElement,
    private http: HttpClient,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.delCallback = this.deleteGoup.bind(this);
    this.global.timeLeft.subscribe((val) => (this.time = val));
    this.global.canUpdateGroups.subscribe((val) => (this.canUpdate = val));
    this.groupsData = this.global.groupData;
    if (!this.global.groupData) this.loadGroups();
    this.usersList = this.global.userList;
    this.conversationsList = this.global.conversationsList;
    if (!this.global.userList) this.loadUsers();
    this.global.timeLeftUsersUpd.subscribe((val) => (this.usersUpdTimer = val));
  }

  loadUsers() {
    this.http
      .get<IUsers>(USER_LIST_URL, {
        headers: getHeaders(),
        observe: 'body',
      })
      .pipe(catchError(async () => this.openSnackBar('Somesing went wrong')))
      .subscribe((data) => {
        if (data) {
          this.usersList = data;
          this.global.setUsersList(data);
        }
      });

    this.http
      .get<IConversations>(CONVERSATIONS_LIST_URL, {
        headers: getHeaders(),
        observe: 'body',
      })
      .pipe(catchError(async () => this.openSnackBar('Somesing went wrong')))
      .subscribe((data) => {
        if (data) {
          const list = data.Items.map((el) => el.companionID.S);
          this.conversationsList = list;
          this.global.setConvers(list);
        }
      });
  }

  updateUsers() {
    this.loadUsers();
    this.global.startTimerUsersUpd();
  }

  updateGroups() {
    this.loadGroups();
    this.global.startTimer();
  }

  loadGroups() {
    this.http
      .get<IGroups>(GROUP_URL, { headers: getHeaders(), observe: 'body' })
      .pipe(catchError(async () => this.openSnackBar('Somesing went wrong')))
      .subscribe((data) => {
        if (data) {
          this.groupsData = data;
          this.global.setGroupData(data);
        }
      });
  }

  createGroup() {
    const dialogRef = this.dialog.open(DialogGreateGroupComponent);

    dialogRef.afterClosed().subscribe((val) => {
      this.http
        .post<{ groupID: string }>(
          GROUP_GREATE,
          {
            name: val,
          },
          {
            headers: getHeaders(),
            observe: 'body',
          }
        )
        .pipe(
          retry(3),
          catchError(async () =>
            this.openSnackBar('Somesing went wrong try again')
          )
        )
        .subscribe((data) => {
          if (!data) return;
          this.groupsData?.Items.push({
            id: { S: data.groupID },
            name: { S: val },
            createdAt: { S: Date.now() + '' },
            createdBy: { S: loadFromStorage().uid + '' },
          });
          this.openSnackBar('You create group');
        });
    });
  }

  public deleteGoup(groupId: string, name: string) {
    this.http
      .delete(GROUP_DELETE + `${groupId}`, {
        headers: getHeaders(),
        observe: 'response',
      })
      .pipe(
        retry(1),
        catchError(async () =>
          this.openSnackBar('Somesing went wrong try again')
        )
      )
      .subscribe((data) => {
        if (data) {
          if (data.ok) {
            this.openSnackBar(`You delete group ${name}`);
            const obj = this.groupsData?.Items.find(
              (obj) => obj.id.S === groupId
            );
            const index = obj ? this.groupsData?.Items.indexOf(obj) : null;
            index ? this.groupsData?.Items.splice(index, 1) : null;
          }
        }
      });
  }

  goToConvers(user: IOneUser) {
    let canOpen: boolean = false;
    let target: string = '';

    this.conversationsList?.map((el) => {
      if (el === user.uid.S) {
        canOpen = true;
        target = el;
      }
    });

    if (canOpen) {
      this.router.navigate(['conversation', target]);
      return;
    }

    this.http
      .post<{ conversationID: string }>(
        CONVERSATIONS_GREATE,
        { companion: user.uid.S },
        {
          headers: getHeaders(),
          observe: 'body',
        }
      )
      .pipe(
        retry(1),
        catchError(async () =>
          this.openSnackBar('Somesing went wrong try again')
        )
      )
      .subscribe((data) => {
        if (data) {
          this.router.navigate(['conversation', data.conversationID]);
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
}
