import {Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import {AuthService} from '../services/auth.service';

let modelUrl;

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.css']
})
export class ModelComponent implements OnInit, OnDestroy {

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private authService: AuthService
  ) {
  }

  title = 'Интерактивная модель';

  modelValue;
  name = '';
  subModelCondition = true;

  @HostListener('document:keydown.control.z') undo(event: KeyboardEvent) {
    localStorage.setItem('model', '3');
  }

  ngOnInit(): void {
    //
    this.titleService.setTitle(this.title);
    //
    if (this.router.url === '/model') {
      this.dataService.addPageData(this.title);
      this.dataService.pageDataEmit();
    }
    // Проверка поля expires
    this.authService.lsExpiresHandler('check', 'update');
    this.modelValue = localStorage.getItem('model');
    if (this.modelValue == null) {
      localStorage.setItem('model', '1');
    }
    // if (this.modelValue === '1') {
    //   localStorage.setItem('modelPath', '../../assets/models/fbx/model111.fbx');
    // } else if (this.modelValue === '2') {
    //   localStorage.setItem('modelPath', '../../assets/models/fbx/model111.fbx');
    // } else if (this.modelValue === '3') {
    //   localStorage.setItem('modelPath', '../../assets/models/fbx/test.fbx');
    // }

  }

  ngOnDestroy(): void {}

  init(): void {}

}
