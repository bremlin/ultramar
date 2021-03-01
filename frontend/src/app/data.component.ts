import {Component, OnInit} from '@angular/core';
import { DataService } from './data.service';


export class DataComponent implements OnInit {

  newItem: string;
  items: string[] = [];
  constructor(private dataService: DataService) {}

  addItem(name: string) {
    this.dataService.addPageData(name);
  }

  ngOnInit() {
    this.items = this.dataService.getPageData();
  }

}
