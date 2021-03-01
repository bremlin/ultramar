import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  @Output() dataChange: EventEmitter<string> = new EventEmitter();
  @Output() data2Change: EventEmitter<boolean> = new EventEmitter();

  constructor() { }

  private pageData;
  private isUserLoggedIn = false;

  pageDataEmit() {
    this.dataChange.emit( this.pageData );
  }

  getPageData() {
    return this.pageData;
  }

  addPageData(pageData) {
    this.pageData = pageData;
  }

  userStateEmit() {
    this.data2Change.emit( this.isUserLoggedIn );
  }

  getUserState() {
    return this.isUserLoggedIn;
  }

  addUserState(isUserLoggedIn) {
    this.isUserLoggedIn = isUserLoggedIn;
  }
}
