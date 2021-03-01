import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import construct = Reflect.construct;
import * as gvs from '../global-variables';

@Injectable({
  providedIn: 'root',
})
export class VideoService {

  VIDEO_URL = gvs.protocol + gvs.hostName + 'getmedia';
  UPLOAD_VIDEO_URL = gvs.protocol + gvs.hostName + 'uploadmedia';
  // DOWNLOAD_VIDEO_URL = 'http://f.ibcon.ru:8080/byterange';
  DOWNLOAD_VIDEO_URL = gvs.protocol + gvs.hostName + 'downloadvideo';
  URL_VIDEO = gvs.protocol + gvs.hostName + 'videoonepiece?id=';
  REMOVE_VIDEO_URL = gvs.protocol + gvs.hostName + 'removefolder';

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
  // Http опции тип application/json
  httpOptionsVi = {
    headers: new HttpHeaders({
      'Content-Type': '',
    })
  };

  constructor(
    private http: HttpClient
  ) {
  }

  postGetBuildings(): Observable<any> {
    const body = {};
    return this.http.post(this.GET_BUILDINGS_URL, body, this.httpOptionsJs)
      .pipe(
        catchError(this.errorManager)
      );
  }

  postVideoData(): Observable<any> {
    const body = {
      type: 'video'
    };
    return this.http.post(this.VIDEO_URL, body, this.httpOptionsJs)
      .pipe(
      catchError(this.errorManager)
    );
  }

  postUploadVideo(varUserId: number, varName: string, varFile: File, varBuildingId: number): Observable<any> {
    const formData: any = new FormData();
    formData.append('file', varFile);
    formData.append('name', varName);
    formData.append('type', 'video');
    formData.append('userId', varUserId);
    formData.append('buildingId', varBuildingId);
    console.log(varBuildingId, varUserId, varName);
    return this.http.post(this.UPLOAD_VIDEO_URL, formData, {reportProgress: true, observe: 'events', responseType: 'json'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  // postDownloadVideo(varId: number): Observable<any> {
  //   const body = {};
  //   return this.http.post(this.DOWNLOAD_VIDEO_URL, body)
  //     .pipe(
  //       catchError(this.errorManager)
  //     );
  // }

  postDownloadVideo(varVideoId): Observable<any> {
    const body = {
      id: varVideoId
    };
    return this.http.post(this.DOWNLOAD_VIDEO_URL, body, {reportProgress: true, observe: 'events', responseType: 'text'})
      .pipe(
        catchError(this.errorManager)
      );
  }

  postRemoveVideo(varId: number): Observable<any> {
    const body = {
      id: varId
    };
    return this.http.post(this.REMOVE_VIDEO_URL, body, this.httpOptionsJs)
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


  getUrl(varId: number): string {
    return this.URL_VIDEO + varId;
  }

}
