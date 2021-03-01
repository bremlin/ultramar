import {EventEmitter, Injectable, Output} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as gvs from '../global-variables';
import {throwError} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class HttpService {

  url = gvs.protocol + gvs.hostName + 'greeting';
  fileTreeUrl = gvs.protocol + gvs.hostName + 'getfilesfortree';
  addFolderUrl = gvs.protocol + gvs.hostName + 'addfolder';
  rootFolderUrl = gvs.protocol + gvs.hostName + 'getrootfortree';
  removeFolderUrl = gvs.protocol + gvs.hostName + 'removefolder';

  // Http опции
  httpOptions = {
    // Заголовки
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  @Output() data3Change: EventEmitter<string> = new EventEmitter();
  @Output() userNameChange: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  private uniqueKey = '187456$#@$^@1ULT';
  private userRole: string;

  public postFileTree(varParentId) {
    const body = {
      parentId: varParentId
    };
    return this.http.post(this.fileTreeUrl, body, this.httpOptions);
  }

  public postAddFolder(varParentId, varFolderName, varUserId) {
    const body = {
      parentId: varParentId,
      name: varFolderName,
      isFolder: true,
      userId: varUserId
    };
    return this.http.post(this.addFolderUrl, body, this.httpOptions);
  }

  public postRemoveFolder(varFolderId) {
    const body = {
      id: varFolderId,
    };
    return this.http.post(this.removeFolderUrl, body, this.httpOptions);
  }

  public postRootFolder() {
    const body = {};
    return this.http.post(this.rootFolderUrl, body, this.httpOptions);
  }

  isAuthenticated() {
    const varId = localStorage.getItem('id');
    const varUserName = localStorage.getItem('userName');
    const varPassword = localStorage.getItem('password');
    if (varId && varUserName && varPassword) {
      return varId > '0';
    } else {
      return false;
    }
  }

  decode() {
    const varRole = JSON.parse(localStorage.getItem('userRoles'));
    if (varRole[0].id === 1) {
      return {Role: 'admin'};
    } else if (varRole[0].id === 2) {
      return {Role: 'portalUser'};
    }
  }

}
