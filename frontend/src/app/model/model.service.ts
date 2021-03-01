import {EventEmitter, Injectable, OnInit, Output} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModelService {

  constructor(
  ) {
  }

  private meshData;
  private subModelData = false;

  @Output() meshDataChange: EventEmitter<string> = new EventEmitter();
  @Output() subModelDataChange: EventEmitter<boolean> = new EventEmitter();

  meshDataSet(varMeshData) {
    this.meshData = varMeshData;
  }

  // Emit
  public meshDataEmit(varTest) {
    this.meshDataChange.emit(varTest);
  }

  public subModelDataEmit(varState) {
    this.subModelDataChange.emit(varState);
  }

}
