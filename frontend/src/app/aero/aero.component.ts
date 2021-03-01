import {Component, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {ModalDismissReasons, NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../services/auth.service';
import {AeroService} from '../services/aero.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-aero',
  templateUrl: './aero.component.html',
  styleUrls: ['./aero.component.css'],
  providers: [ AeroService ]
})
export class AeroComponent implements OnInit, OnDestroy {

  title = 'Аэрофотосъёмка';

  dataModal1 = [
    {
      id: '',
      parentId: '',
      docName: '',
      fileName: '',
      origName: '',
      author: '',
      type: '',
      uploadDate: '',
      file: '',
      buildingId: ''
    }
  ];
  dataModal2 = [];
  frontendData1 = {data: null};
  condition = false;
  tempMap = new Map();
  sortMap = new Map();
  // Сгрупированный map по наименованию документа
  groupMap = new Map();
  // Массив сооружений
  buildingArr = [];
  buildingMap = new Map();
  varNull = -1;
  progress = 0;
  form: FormGroup;
  error: string;
  tempArray = [];

  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef; files = [];

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private aeroService: AeroService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
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
    if (this.router.url === '/aero') {
      this.dataService.addPageData(this.title);
      this.dataService.pageDataEmit();
    }
    // Проверка поля expires
    this.authService.lsExpiresHandler('check', 'update');
    //
    this.aeroService.postAeroData().subscribe(
      (response) => {
        this.frontendData1.data = JSON.parse(JSON.stringify(response, null, 1));
        console.log(this.frontendData1.data);
        localStorage.setItem('aeroData', JSON.stringify(response, null, 1));
        // todo Вызов функции из блока response
        this.downloadPhoto();
      },
      (error) => console.log(error)
    );
    this.getBuildings();
  }

  ngOnDestroy(): void {
    localStorage.removeItem('aeroData');
  }

  // Получение списка сооружений
  getBuildings() {
    this.aeroService.postGetBuildings().subscribe(
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

  getAllDates() {
    let tempMap = new Map();
    tempMap.set(1, 'Март 2020 г.');
    tempMap.set(2, 'Апрель 2020 г.');
    return tempMap.values();
  }

  getBuildingName(varBuildingId) {
    return this.buildingMap.get(varBuildingId).name;
  }

  // Данные для модального окна
  dataForMpModal(varId, content): void {
    let arrAero = this.frontendData1.data.filter(e => e.id === varId);
    this.dataModal1[0] = arrAero[0];
    let arrAero2 = this.tempArray.filter(e => e.id === varId);
    this.dataModal2[0] = arrAero2[0];
    this.modalService.open(content, {scrollable: true});
  }

  modalHandler(content) {
    this.modalService.open(content, {centered: true, windowClass: 'customModalClass'});
  }

  // Обновление шаблона
  refreshData() {
    this.condition = false;
    this.aeroService.postAeroData().subscribe(
      (response) => {
        this.frontendData1.data = JSON.parse(JSON.stringify(response, null, 1));
        this.downloadPhoto();
      },
      (error) => console.log(error)
    );
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').setValue(file);
  }

  submitUploadPhoto() {
    // Получение текущего id пользователя
    const varUserId = localStorage.getItem('id');
    //
    this.aeroService.postUploadPhoto(
      parseInt(varUserId, 10),
      this.form.value.name,
      this.form.value.avatar,
      this.form.value.buildingId
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
            // Обновление
            this.refreshData();
          }, 1500);
      }
    });
  }

  downloadPhoto() {
    for (let i of this.frontendData1.data) {
        this.aeroService.postDownloadPhoto1(i.id).subscribe((response) => {
          const reader = new FileReader();
          reader.readAsDataURL(response);
          reader.onloadend = () => {
              const body = {
                id: i.id,
                data: reader.result
              };
              this.tempArray.push(body);
              this.tempMap.set(i.id, reader.result);
              if (this.groupMap.has(i.buildingId)) {
                this.groupMap.get(i.buildingId).add(this.tempMap.get(i.id));
              } else {
                const tempSet = new Set();
                tempSet.add(this.tempMap.get(i.id));
                this.groupMap.set(i.buildingId, tempSet);
              }
          };
        }, (error) => console.log('aero.component.ts: ' + error));
    }

    // todo ERROR Error: ExpressionChangedAfterItHasBeenCheckedError
    this.condition = true;
  }

  removePhoto(varPhotoId) {
    this.aeroService.postRemovePhoto(varPhotoId).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    );
    this.refreshData();
  }

  imageHandler(varId, buildingId) {
    return this.groupMap.get(buildingId);
  }

  selectStructureHandler(varBuildingId) {
    this.condition = false;
    this.varNull = parseInt(varBuildingId, 10);
    this.filterHandler(varBuildingId);
  }

  filterHandler(varBuildingId) {
    const testMap = new Map();
    // todo ERROR TypeError: this.frontendData1.data is not iterable
    if (varBuildingId === -1) {
      for (let frontendData1Key of this.frontendData1.data) {
        testMap.set(frontendData1Key.buildingId, frontendData1Key);
      }
    } else {
      for (let frontendData1Key of this.frontendData1.data) {
        if (frontendData1Key.buildingId === parseInt(varBuildingId, 10)) {
          testMap.set(frontendData1Key.buildingId, frontendData1Key);
        }
      }
      this.condition = true;
    }
    return testMap.values();
  }


}
