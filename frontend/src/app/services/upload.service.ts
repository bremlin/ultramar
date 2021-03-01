import {HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Observable, Subscription, throwError} from 'rxjs';
import {toInteger} from '@ng-bootstrap/ng-bootstrap/util/util';
import * as gvs from '../global-variables';


@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  UPLOAD_URL = gvs.protocol + gvs.hostName + 'upload';
  DOWNLOAD_URL = gvs.protocol + gvs.hostName + 'download';


  octetStream = {
    headers: new HttpHeaders({
      'Content-Type': 'blob',
    })
  };

  addUser(parentId: number, userId: number, name: string, profileImage: File): Observable<any> {
    const formData: any = new FormData();
    formData.append('parentId', parentId);
    formData.append('userId', userId);
    formData.append('name', name);
    formData.append('file', profileImage);
    // DEBUG formData
    // new Response(formData).text().then(console.log);
    return this.httpClient.post(this.UPLOAD_URL, formData, {reportProgress: true, observe: 'events'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  downloadFile(varId: number) {
    const body = {
      id: varId
    };
    return this.httpClient.post(this.DOWNLOAD_URL, body, {responseType: 'blob'})
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
