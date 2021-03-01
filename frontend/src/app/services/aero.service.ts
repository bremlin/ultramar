import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import * as gvs from '../global-variables';

@Injectable({
  providedIn: 'root',
})
export class AeroService {

  AERO_URL = gvs.protocol + gvs.hostName + 'getmedia';
  UPLOAD_MEDIA_URL = gvs.protocol + gvs.hostName + 'uploadmedia';
  DOWNLOAD_MEDIA_URL = gvs.protocol + gvs.hostName + 'download';
  REMOVE_MEDIA_URL = gvs.protocol + gvs.hostName + 'removefolder';

  GET_BUILDINGS_URL = gvs.protocol + gvs.hostName + 'getbuildings';

  // Http опции тип application/json
  httpOptionsJs = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };
  // Http опции тип multipart/form-data
  httpOptionsMu = {
    headers: new HttpHeaders({
      'Content-Type': 'multipart/form-data',
    })
  };

  constructor(
    private http: HttpClient
  ) {
  }

  private uniqueKey = '187456$#@$^@1ULT';
  private userRole: string;

  postAeroData() {
    const body = {
      type: 'photo'
    };
    return this.http.post(this.AERO_URL, body, this.httpOptionsJs);
  }

  postUploadPhoto(varUserId: number, varName: string, varFile: File, varBuildingId: number): Observable<any> {
    const formData: any = new FormData();
    formData.append('file', varFile);
    formData.append('name', varName);
    formData.append('type', 'photo');
    formData.append('userId', varUserId);
    formData.append('buildingId', varBuildingId);
    // DEBUG formData
    // new Response(formData).text().then(console.log);
    return this.http.post(this.UPLOAD_MEDIA_URL, formData, {reportProgress: true, observe: 'events', responseType: 'json'})
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

  postDownloadPhoto1(varId: number): Observable<any> {
    const body = {
      id: varId
    };
    return this.http.post(this.DOWNLOAD_MEDIA_URL, body, {responseType: 'blob'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postRemovePhoto(varId: number): Observable<any> {
    const body = {
      id: varId
    };
    return this.http.post(this.REMOVE_MEDIA_URL, body, this.httpOptionsJs)
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
