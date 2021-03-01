import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {CryptService} from './crypt.service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

import * as gvs from '../global-variables';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  url = gvs.protocol + gvs.hostName + 'greeting';
  authUrl = gvs.protocol + gvs.hostName + 'auth';
  roleUrl = gvs.protocol + gvs.hostName + 'getrole';

  private uniqueKey = '123456$#@$^@1ERF';
  private userRole: string;

  // Http опции
  httpOptions = {
    // Заголовки
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  @Output() data3Change: EventEmitter<string> = new EventEmitter();
  @Output() userNameChange: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private router: Router,
    private cryptService: CryptService
  ) {
  }

  postLoginData(varLogin, varPassword): Observable<any> {
    const body = {
      login: varLogin,
      password: varPassword
    };
    return this.http.post(this.authUrl, body, this.httpOptions)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postUserRole(varPassword, varUsername, varId) {
    const body = {
      userName: varUsername,
      password: varPassword,
      id: varId
    };
    return this.http.post(this.roleUrl, body, this.httpOptions);
  }

  userRoleAdd(varUserRole) {
    this.userRole = varUserRole;
  }

  userRoleEmit() {
    if (localStorage.length !== 0) {
      this.data3Change.emit(localStorage.getItem('userRoles'));
    } else {
      this.data3Change.emit(null);
    }
  }

  userNameEmit() {
    this.userNameChange.emit(localStorage.getItem('userName'));
  }

  userRoleClear() {
    this.userRole = null;
  }

  getUniqueKey() {
    return this.uniqueKey;
  }

  // localStorage
  // Обработка поля expires
  lsExpiresHandler(varAction, varSubAction) {

    const cryptHandler = (varData, varLocalStorageElem) => {
      if (varLocalStorageElem === 'get') {
        const varTest = localStorage.getItem('expires');
        return this.cryptService.get(this.uniqueKey, varTest).toString();
      }
    };

    // Обновление поля expires
    const update = () => {
      // Обновление поля
      // Добавление 30 минут
      varDate.setMinutes(varDate.getMinutes() + 30);
      const varCryptDate = this.cryptService.set(this.uniqueKey, varDate);
      // Обновление
      localStorage.setItem('expires', varCryptDate);
    };

    // Текущая дата
    const varDate = new Date();
    // console.log(varDate);
    // Дата из поля
    const varExpires = new Date(cryptHandler('expires', 'get'));
    // console.log(varExpires);

    if (varAction === 'check') {
      // Проверка поля
      if (varDate > varExpires) {
        this.userRoleClear();
        localStorage.clear();
        this.router.navigate(['./login']).then(r => {
        });
        console.log('Expired!');
        return;
      } else if (varDate < varExpires) {
        if (varSubAction === 'update') {
          console.log('notExpired, update');
          // Обновление поля
          update();
          return;
        }
      }
    } else if (varAction === 'update') {
      // Обновление поля
      update();
    }
  }

  errorManager(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
