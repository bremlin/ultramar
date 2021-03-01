import {Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import {UploadService} from '../services/upload.service';
import {HttpService} from '../services/http.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as FileSaver from 'file-saver';

export class Folder {
  folderName: string;
  uploadDate;
  author;
  storeFolderName: string;
}

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
  providers: [ UploadService ]
})
export class StoreComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef; files = [];

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private uploadService: UploadService,
    public httpService: HttpService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      parentId: '',
      userId: '',
      name: [''],
      avatar: ['']
    });
  }

  condition = true;
  folderId: number;
  folder: Folder = new Folder();
  disabled = 'disabled';

  frontendData = {
    folders1: null,
  };

  title = 'Хранилище';

  progress = 0;
  form: FormGroup;
  error: string;
  userId = 1;
  uploadResponse = {status: '', message: '', filePath: ''};
  breadcrumbMap = new Map();
  breadcrumbArr = [];
  folderMap = new Map();

  ngOnChanges() {
  }

  ngOnInit(): void {
    //
    this.titleService.setTitle(this.title);
    //
    if (this.router.url === '/store') {
      this.dataService.addPageData(this.title);
      this.dataService.pageDataEmit();
    }
    if (this.rootFolder()) {
      this.frontendData.folders1 = JSON.parse(localStorage.getItem('storeRootFolder'));
    }
    //
    const varFolderName = [{folderName: 'Хранилище'}];
    // Запись значения folderName начальной директории
    localStorage.setItem('storeFolderName', JSON.stringify(varFolderName));
    //
    this.folder.storeFolderName = varFolderName[0].folderName;
    //
    this.breadcrumbArr.push({id: 0, docName: 'Хранилище'});
  }

  ngOnDestroy(): void {
    // Очистка localStorage от временных переменных
    localStorage.removeItem('storeParentId');
    localStorage.removeItem('storeLastRemovedFolderId');
  }

  // Обработка нажатия на файл / директорию
  rowClickHandler( event: Event ): void {
    // id элемента
    const varTargetId = (event.target as Element).id;
    // Получение элемента по параметру id
    let varStoreElement;
    const arrStoreParentIdLast = JSON.parse(localStorage.getItem('storeRootFolder'));
    varStoreElement = arrStoreParentIdLast.filter(e => e.id === parseInt(varTargetId, 10));
    //
    if (!varStoreElement[0].file) {
      this.showNextFolder(event);
    } else if (varStoreElement[0].file) {
      this.downloadFile(varTargetId, varStoreElement[0].origName);
    } else {
      console.log('Ошибка');
    }
  }

  // Загрузка файла
  downloadFile(varTargetId, varFileName) {
    this.uploadService.downloadFile(varTargetId).subscribe((data) => FileSaver.saveAs(data, varFileName, { autoBom: true }));
  }

  // Удаление директории
  removeFolder(varFolderId): void {
    // Запись параметра id удаленной директории
    localStorage.setItem('storeLastRemovedFolderId', varFolderId);

    this.httpService.postRemoveFolder(varFolderId).subscribe(
      (response) => {
        // Обновление данных
        this.refreshData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      avatar: file
    });
    this.form.get('avatar').setValue(file);
  }

  submitUser() {
    // Получение текущего id пользователя
    const varUserId = localStorage.getItem('id');
    // Получение текущего parentId
    let varStoreParentId;
    const arrStoreParentIdLast = JSON.parse(localStorage.getItem('storeParentId'));
    varStoreParentId = arrStoreParentIdLast[arrStoreParentIdLast.length - 1];
    //
    this.uploadService.addUser(
      parseInt(varStoreParentId.parentId, 10),
      parseInt(varUserId, 10),
      this.form.value.name,
      this.form.value.avatar
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
            // Обновление данных
            this.refreshData();
          }, 1500);
      }
    });
  }

  // Обновление текущей директории хранилища
  refreshData() {
    let varStoreParentId;
    const arrStoreParentIdLast = JSON.parse(localStorage.getItem('storeParentId'));
    varStoreParentId = arrStoreParentIdLast[arrStoreParentIdLast.length - 1];

    if (varStoreParentId.parentId !== 0) {
      // Отображение стрелки "Назад"
      document.getElementById('previous-row').setAttribute('style', 'cursor: pointer; display: table-row;');
      // Получение дерева по parentId
      this.httpService.postFileTree(varStoreParentId.parentId).subscribe(
        (response) => {
          // Переписывание storeRootFolder
          localStorage.setItem('storeRootFolder', JSON.stringify(response, null, 1));
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // Скрытие стрелки "Назад"
      document.getElementById('previous-row').setAttribute('style', 'cursor: pointer; display: none;');
      // Получение корневого дерева директорий
      this.httpService.postRootFolder().subscribe(
        (response) => {
          localStorage.setItem('storeRootFolder', JSON.stringify(response, null, 1));
          // console.log(JSON.stringify(response, null, 1));
        },
        (error) => {
          console.log(error);
        }
      );
    }

    this.condition = false;
    this.condition = true;
  }

  // Добавление директории
  addFolder() {
    let varStoreParentId;
    const arrStoreParentIdLast = JSON.parse(localStorage.getItem('storeParentId'));
    varStoreParentId = arrStoreParentIdLast[arrStoreParentIdLast.length - 1];

    this.httpService.postAddFolder(
      varStoreParentId.parentId,
      this.folder.folderName,
      localStorage.getItem('id')
    ).subscribe(
      (response) => {
        // Обновление содержимого
        this.refreshData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // Отображение модального окна
  showModal(content) {
    this.modalService.open(content, {centered: true, windowClass: 'customModalClass'});
  }

  rootFolder() {
    // Запись значения parentId начальной директории
    const varParentId = [{parentId: 0, docName: 'Хранилище'}];
    localStorage.setItem('storeParentId', JSON.stringify(varParentId));
    // Получение корневого дерева директорий
    this.httpService.postRootFolder().subscribe(
      (response) => {
        localStorage.setItem('storeRootFolder', JSON.stringify(response, null, 1));
      },
      (error) => {
        console.log(error);
      }
    );
    return true;
  }

  // Обработчик для breadcrumbs
  breadcrumbsHandler(varAction) {
    if (varAction === 'all') {
      return JSON.parse(localStorage.getItem('storeParentId'));
    }
  }

  // Отображение следующей директории
  showNextFolder(event: Event): void {
    this.folderId = parseInt((event.target as Element).id, 10);
    const arrStoreParentId = JSON.parse(localStorage.getItem('storeParentId'));
    const tempFolderName = JSON.parse(localStorage.getItem('storeRootFolder'));
    let varParentId;
    for (const i of tempFolderName) {
      if (i.id === parseInt((event.target as Element).id, 10)) {
        varParentId = {parentId: this.folderId, docName: i.docName};
      }
    }
    arrStoreParentId.push(varParentId);
    localStorage.setItem('storeParentId', JSON.stringify(arrStoreParentId));
    // Отображение стрелки "Назад"
    document.getElementById('previous-row').setAttribute('style', 'cursor: pointer; display: table-row;');
    // Получение дерева по parentId
    let varStoreParentId;
    const arrStoreParentIdLast = JSON.parse(localStorage.getItem('storeParentId'));
    if (arrStoreParentIdLast.length === 2) {
      varStoreParentId = arrStoreParentIdLast[1];
    } else {
      varStoreParentId = arrStoreParentIdLast[arrStoreParentIdLast.length - 1];
    }
    this.httpService.postFileTree(varStoreParentId.parentId).subscribe(
      (response) => {
        // Переписывание storeRootFolder
        localStorage.setItem('storeRootFolder', JSON.stringify(response, null, 1));
      },
      (error) => {
        console.log(error);
      }
    );
    //
    this.frontendData.folders1 = JSON.parse(localStorage.getItem('storeRootFolder'));
  }

  // Отображение предыдущей директории
  showPreviousFolder(event: Event): void {
    const tempId = parseInt((event.target as Element).id, 10);
    let varStoreParentId;
    const arrStoreParentIdLast = JSON.parse(localStorage.getItem('storeParentId'));
    // Для breadcrumbs
    if (tempId === 0) {
      this.rootFolder();
      return this.refreshData();
    }
    if (tempId) {
      const tempArr = [];
      for (const i of arrStoreParentIdLast) {
        tempArr.push(i);
        if (i.parentId === tempId) {
          localStorage.setItem('storeParentId', JSON.stringify(tempArr));
          return this.refreshData();
        }
      }
    }
    if (arrStoreParentIdLast.length === 2) {
      varStoreParentId = arrStoreParentIdLast[0];
    } else {
      varStoreParentId = arrStoreParentIdLast[arrStoreParentIdLast.length - 2];
    }
    if (varStoreParentId.parentId !== 0) {
      // Получение дерева по parentId
      this.httpService.postFileTree(varStoreParentId.parentId).subscribe(
        (response) => {
          // Переписывание storeRootFolder
          localStorage.setItem('storeRootFolder', JSON.stringify(response, null, 1));
        },
        (error) => {
          console.log(error);
        }
      );
      // Удаление последнего элемента массива
      arrStoreParentIdLast.pop();
      localStorage.setItem('storeParentId', JSON.stringify(arrStoreParentIdLast));
      //
      this.folderUpdater();
    } else {
      //
      if (this.rootFolder()) {
        this.folderUpdater();
        // Скрытие стрелки "Назад"
        document.getElementById('previous-row').setAttribute('style', 'cursor: pointer; display: none;');
      }
    }
  }

  // Обновление директорий (для контейнера)
  folderUpdater() {
    this.frontendData.folders1 = JSON.parse(localStorage.getItem('storeRootFolder'));
    return this.frontendData.folders1;
  }
}

