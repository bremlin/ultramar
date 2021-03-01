import {Component, OnInit} from '@angular/core';
import {ModelService} from '../model.service';

@Component({
  selector: 'app-ui-infobar-left',
  templateUrl: './ui-infobar-left.component.html'
})
export class UiInfobarLeftComponent implements OnInit {

  constructor(
    private modelService: ModelService
  ) {
  }

  meshDataMap = new Map();

  ngOnInit(): void {
    //
    this.modelService.meshDataChange.subscribe(data => {
      this.meshDataMap.set(0, data);
    });
  }

  meshData() {
    if (this.meshDataMap.get(0) === undefined) {
      return {
        ID: 0,
        name: 'NaN'
      };
    } else {
      return this.meshDataMap.get(0);
    }
  }

}
