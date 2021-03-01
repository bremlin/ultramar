import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Observable, Subscription, throwError} from 'rxjs';
import * as gvs from '../global-variables';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  INVEST_REPORT_URL = gvs.protocol + gvs.hostName + 'getinvestreport';
  SUM_STRUCTURE_REPORT_URL = gvs.protocol + gvs.hostName + 'getsumstructure';

  constructor(
    private httpClient: HttpClient
  ) {
  }

  postReportData(): Observable<any> {
    const body = {};
    return this.httpClient.post(this.INVEST_REPORT_URL, body, {observe: 'events'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postSumStructureReportData(): Observable<any> {
    const body = {};
    return this.httpClient.post(this.SUM_STRUCTURE_REPORT_URL, body, {observe: 'events', responseType: 'json'})
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
