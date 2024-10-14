import { Component, OnInit } from '@angular/core';
import { chekIsLogin } from 'src/app/shared/helpers/isLogin';
import { GlobalElement } from '../../services/global';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public isLogin: boolean | undefined;

  constructor(private global: GlobalElement) {}

  ngOnInit(): void {
    this.global.isLogin.subscribe((val) => (this.isLogin = val));
    this.global.isLogin.next(chekIsLogin());
  }
}
