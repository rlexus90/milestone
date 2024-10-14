import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUserLogin } from '../../shared/models/user';
import { LOGIN_URL } from 'src/app/shared/constants';
import { catchError } from 'rxjs';
import { SuccessfulLogin } from 'src/app/shared/models/serverData';

@Injectable({
  providedIn: 'root',
})
export class ServerAPI {
  constructor(private http: HttpClient) {}

  public async login(data: IUserLogin) {
    return this.http.post<SuccessfulLogin>(LOGIN_URL, data, {
      observe: 'body',
    });
  }
}
