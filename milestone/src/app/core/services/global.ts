import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { chekIsLogin } from 'src/app/shared/helpers/isLogin';
import { IGroups, IUsers } from 'src/app/shared/models/serverData';

@Injectable()
export class GlobalElement {
  private emailList: string[] = [];
  private interval!: ReturnType<typeof setInterval>;
  private intervalUsersUpd!: ReturnType<typeof setInterval>;
  public isLogin;
  public canUpdateGroups;
  public timeLeft;
  public groupData: IGroups | undefined;
  public userList: IUsers | undefined;
  public timeLeftUsersUpd;
  public conversationsList: string[] | undefined;
  public timerGroupeDialog;
  private intervalGroupeDialog!: ReturnType<typeof setInterval>;
  public timerConversDialog;
  private intervalConversDialog!: ReturnType<typeof setInterval>;

  constructor() {
    this.isLogin = new Subject<boolean>();
    this.canUpdateGroups = new Subject<boolean>();
    this.canUpdateGroups.next(true);
    this.timeLeft = new Subject<number>();
    this.timeLeftUsersUpd = new Subject<number>();
    this.timerGroupeDialog = new Subject<number>();
    this.timerConversDialog = new Subject<number>();
  }

  setEmailList(str: string) {
    this.emailList.push(str);
  }

  getEmailList() {
    return this.emailList;
  }

  setGroupData(data: IGroups) {
    this.groupData = data;
  }

  setUsersList(data: IUsers) {
    this.userList = data;
  }

  setConvers(data: string[]) {
    this.conversationsList = data;
  }

  startTimer() {
    let time = 60;
    this.timeLeft.next(time);
    this.canUpdateGroups.next(false);
    this.interval = setInterval(() => {
      time -= 1;
      this.canUpdateGroups.next(false);
      this.timeLeft.next(time);
    }, 1000);

    this.timeLeft.subscribe((time) => {
      if (time === 0) {
        clearInterval(this.interval);
        this.canUpdateGroups.next(true);
      }
    });
  }

  startTimerUsersUpd() {
    let time = 60;
    this.timeLeftUsersUpd.next(time);
    this.intervalUsersUpd = setInterval(() => {
      time -= 1;
      this.timeLeftUsersUpd.next(time);
    }, 1000);

    this.timeLeftUsersUpd.subscribe((time) => {
      if (time === 0) {
        clearInterval(this.intervalUsersUpd);
      }
    });
  }

  timerUpdateGroupDialog() {
    let time = 60;
    this.timerGroupeDialog.next(time);
    this.intervalGroupeDialog = setInterval(() => {
      time -= 1;
      this.timerGroupeDialog.next(time);
    }, 1000);

    this.timerGroupeDialog.subscribe((time) => {
      if (time === 0) {
        clearInterval(this.intervalGroupeDialog);
      }
    });
  }

  timerUpdateConverDialog() {
    let time = 60;
    this.timerConversDialog.next(time);
    this.intervalConversDialog = setInterval(() => {
      time -= 1;
      this.timerConversDialog.next(time);
    }, 1000);

    this.timerConversDialog.subscribe((time) => {
      if (time === 0) {
        clearInterval(this.intervalConversDialog);
      }
    });
  }
}
