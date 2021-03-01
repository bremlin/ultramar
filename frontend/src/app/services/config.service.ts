import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as gvs from '../global-variables';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  ADD_USER_URL = gvs.protocol + gvs.hostName + 'adduser';
  UPDATE_USER_URL = gvs.protocol + gvs.hostName + 'updateuser';
  REMOVE_USER_URL = gvs.protocol + gvs.hostName + 'deluser';
  GET_USERS_URL = gvs.protocol + gvs.hostName + 'getusers';
  GET_USER_ROLE_URL = gvs.protocol + gvs.hostName + 'getrole';
  GET_ALL_ROLES_URL = gvs.protocol + gvs.hostName + 'getroles';
  SET_USER_ROLE_URL = gvs.protocol + gvs.hostName + 'setrole';

  ADD_BUILDING_URL = gvs.protocol + gvs.hostName + 'addbuilding';
  GET_BUILDINGS_URL = gvs.protocol + gvs.hostName + 'getbuildings';
  REMOVE_BUILDING_URL = gvs.protocol + gvs.hostName + 'delbuilding';

  constructor(
    private http: HttpClient
  ) {
  }

  // Http опции
  httpOptionsJs = {
    // Заголовки
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  postAddUser(varLogin: string, varUsername: string, varUserSurname: string, isFirstFlag: boolean): Observable<any> {
    const body = {
      login: varLogin,
      userName: varUsername,
      userSurName: varUserSurname,
      isFirstFlag: isFirstFlag
    };
    console.log(body);
    return this.http.post(this.ADD_USER_URL, body, {reportProgress: true, observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postRemoveUser(varUserId: number): Observable<any> {
    const body = {
      id: varUserId
    };
    return this.http.post(this.REMOVE_USER_URL, body, {reportProgress: true, observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postSetRole(varUserId: number, varRoleId: number): Observable<any> {
    const body = {
      userId: varUserId,
      id: varRoleId
    };
    return this.http.post(this.SET_USER_ROLE_URL, body, {reportProgress: true, observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postGetUsers(): Observable<any> {
    const body = {};
    return this.http.post(this.GET_USERS_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postGetUserRole(varId: number): Observable<any> {
    const body = {
      id: varId
    };
    return this.http.post(this.GET_USER_ROLE_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postGetAllRoles(): Observable<any> {
    const body = {};
    return this.http.post(this.GET_ALL_ROLES_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postUpdateUser(varUserId: number, varLogin: string, varUsername: string, varUserSurname: string, isFirstName: boolean): Observable<any> {
    const body = {
      id: varUserId,
      login: varLogin,
      userName: varUsername,
      userSurName: varUserSurname,
      isFirstName: isFirstName
    };
    console.log(body);
    return this.http.post(this.UPDATE_USER_URL, body, {reportProgress: true, observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postAddBuilding(varCode: number, varName: string): Observable<any> {
    const body = {
      code: varCode,
      name: varName
    };
    return this.http.post(this.ADD_BUILDING_URL, body, {reportProgress: true, observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postRemoveBuilding(varId: number): Observable<any> {
    const body = {
      id: varId
    };
    return this.http.post(this.REMOVE_BUILDING_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postGetBuildings(): Observable<any> {
    const body = {};
    return this.http.post(this.GET_BUILDINGS_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
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
