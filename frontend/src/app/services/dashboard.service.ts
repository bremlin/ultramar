import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import * as gvs from '../global-variables';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  KEY_URL = gvs.protocol + gvs.hostName + 'getkeyprojectevents';
  SMR_URL = gvs.protocol + gvs.hostName + 'getsmrprogress';
  VOL_URL = gvs.protocol + gvs.hostName + 'getprojectprogressvolconstruct';
  GORIK_QUERY_URL = gvs.protocol + gvs.hostName + 'getgoriksequence';
  GORIK_QUERY_CREATE_URL = gvs.protocol + gvs.hostName + 'createMonthSequence';

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

  postGetGorikQuery(): Observable<any> {
    const body = {};
    return this.http.post(this.GORIK_QUERY_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postKeyData(): Observable<any> {
    const body = {};
    return this.http.post(this.KEY_URL, body, {observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postSmrData(): Observable<any> {
    const body = {};
    return this.http.post(this.SMR_URL, body, {observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postVolData(): Observable<any> {
    const body = {};
    return this.http.post(this.VOL_URL, body, {observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postGorikGenerateSequence(month: number, year: number): Observable<any> {
    const body = {
      // month: month,
      // year: year
    };
    return this.http.post(this.GORIK_QUERY_CREATE_URL, body, this.httpOptionsJs)
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
