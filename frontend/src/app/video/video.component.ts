import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {VideoService} from '../services/video.service';
import {AuthService} from '../services/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {FormGroup, FormBuilder} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
  providers: [ VideoService ]
})
export class VideoComponent implements OnInit, OnDestroy {

  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef; files = [];

  title = 'Видеопрезентация';

  frontendData1 = [];
  condition = false;
  progress = 0;
  videoForm: FormGroup;
  error: string;
  tempMap = new Map();
  // Сгрупированный map по наименованию документа
  groupMap = new Map();

  tempArr = [];
  show = false;

  videoSource;
  // Массив сооружений
  buildingArr = [];
  buildingMap = new Map();

  videoMap = new Map();
  varNull = -1;

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private videoService: VideoService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.videoForm = this.formBuilder.group({
      avatar: [''],
      name: [''],
      type: '',
      userId: '',
      buildingId: ['']
    });
  }

  ngOnInit(): void {
    //
    this.titleService.setTitle(this.title);
    //
    if (this.router.url === '/video') {
      this.dataService.addPageData(this.title);
      this.dataService.pageDataEmit();
    }
    // Проверка поля expires
    this.authService.lsExpiresHandler('check', 'update');
    //
    this.videoService.postVideoData().subscribe(
      (response) => {
        this.frontendData1 = JSON.parse(JSON.stringify(response, null, 1));
        console.log(this.frontendData1);
        // todo Вызов функции из блока response
        this.downloadVideo();
      },
      (error) => console.log(error)
    );
    this.getBuildings();
  }

  ngOnDestroy(): void {}

  // Получение списка сооружений
  getBuildings() {
    this.videoService.postGetBuildings().subscribe(
      (response) => {
        this.buildingArr = JSON.parse(JSON.stringify(response, null, 1));
        for (let i = 0; i < this.buildingArr.length; i++) {
          this.buildingMap.set(this.buildingArr[i].id, this.buildingArr[i]);
        }
      },
      (error) => console.log('aero.component.ts: ' + error)
    );
  }

  getAllBuildings() {
    return this.buildingArr;
  }

  getBuildingName(varBuildingId) {
    return this.buildingMap.get(varBuildingId).name;
  }

  getUrl(varVideoId) {
    return this.videoService.getUrl(varVideoId);
  }

  getVideo(varVideoId) {
    return this.videoMap.get(varVideoId);
  }

  downloadVideo() {
    for (const i of this.frontendData1) {
      this.videoMap.set(i.id, null);

      // this.videoService.postDownloadVideo(i.id).subscribe((event: HttpEvent<any>) => {
      //   switch (event.type) {
      //     case HttpEventType.Sent:
      //       console.log('Запрос был создан!');
      //       break;
      //     case HttpEventType.ResponseHeader:
      //       console.log('Заголовок ответа получен!');
      //       break;
      //     case HttpEventType.UploadProgress:
      //       console.log(`Загружено!`);
      //       break;
      //     case HttpEventType.Response:
      //       console.log('Получен ответ об успешной загрузке файла!');
      //       this.videoSource = event.body;
      //       this.videoMap.set(i.id, event.body);
      //       this.condition = true;
      //   }
      // }, (error) => console.log('video.component.ts: ' + error));
    }
    this.condition = true;

    // todo ERROR Error: ExpressionChangedAfterItHasBeenCheckedError
  }

  // Обновление шаблона
  refreshData() {
    this.condition = false;
    this.videoService.postVideoData().subscribe(
      (response) => {
        this.frontendData1 = JSON.parse(JSON.stringify(response, null, 1));
        this.downloadVideo();
      },
      (error) => console.log(error)
    );
  }

  removePhoto(varPhotoId) {
    this.videoService.postRemoveVideo(varPhotoId).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
    this.refreshData();
  }

  selectStructureHandler(varBuildingId) {
    this.condition = false;
    this.varNull = parseInt(varBuildingId, 10);
    this.filterHandler(varBuildingId);
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.videoForm.patchValue({
      avatar: file
    });
    this.videoForm.get('avatar').setValue(file);
  }

  submitUploadVideo() {
    // Получение текущего id пользователя
    const varUserId = localStorage.getItem('id');
    //
    this.videoService.postUploadVideo(
      parseInt(varUserId, 10),
      this.videoForm.value.name,
      this.videoForm.value.avatar,
      parseInt(this.videoForm.value.buildingId, 10)
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Запрос был создан!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Заголовок ответа получен!');
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Загружено! ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('Получен ответ об успешной загрузке файла!', event.body);
          setTimeout(() => {
            this.progress = 0;
            // // Обновление
            // this.refreshData();
          }, 1500);
      }
    });
  }

  modalHandler(content) {
    this.modalService.open(content, {centered: true, windowClass: 'customModalClass'});
  }

  filterHandler(varBuildingId) {
    const testMap = new Map();
    // todo ERROR TypeError: this.frontendData1 is not iterable
    if (varBuildingId === -1) {
      for (let frontendData1Key of this.frontendData1) {
        testMap.set(frontendData1Key.buildingId, frontendData1Key);
      }
    } else {
      for (let frontendData1Key of this.frontendData1) {
        if (frontendData1Key.buildingId === parseInt(varBuildingId, 10)) {
          testMap.set(frontendData1Key.buildingId, frontendData1Key);
        }
      }
      this.condition = true;
    }
    return testMap.values();
  }

}
