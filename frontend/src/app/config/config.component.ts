import {Component, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

// @ts-ignore
import * as pvtype from '../../assets/jsons/pvtype.json';
// @ts-ignore
import * as uom from '../../assets/jsons/uom.json';
// @ts-ignore
import * as user from '../../assets/jsons/user.json';
// @ts-ignore
import * as subobject from '../../assets/jsons/subobject.json';
import {ConfigService} from '../services/config.service';
import {AuthService} from '../services/auth.service';
import {NodeLib} from 'three/examples/jsm/nodes/core/NodeLib';
import contains = NodeLib.contains;
import {FormBuilder, FormGroup} from '@angular/forms';
import {HttpEvent, HttpEventType} from '@angular/common/http';

export class User {
  id: number;
  name: string;
  surname: string;
  login: string;
  firstFlag: boolean;
}

export class Building {
  code: number;
  name: number;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  providers: [ConfigService]
})
export class ConfigComponent implements OnInit {

  title = 'Настройки';
  subObject: any = (subobject as any).default;
  localUser: any = (user as any).default;
  uOm: any = (uom as any).default;
  user: User = new User();
  building: Building = new Building();
  disabled = 'disabled';
  progress = 0;
  error: string;
  userRoleUpdate = false;
  buildingForm: FormGroup;
  userForm: FormGroup;
  userUpdateForm: FormGroup;
  userFormCondition = false;
  usersCondition = true;

  // Массив пользователей
  userArr = [];
  // Массив сооружений
  buildingArr = [];
  // Массив всех ролей
  allRoleArr = [];
  // Массив сопоставления ролей
  roleCompareArr = [];

  userMap = new Map();
  roleMap = new Map();
  allRoleMap = new Map();
  allNameRoleMap = new Map();
  roleCompareMap = new Map();

  pvDataFiltered = [
    {id: 'UPV00', name: 'Инженерная подготовка территории'}, {id: 'UPV01', name: 'Гидротехнические работы'},
    {id: 'UPV02', name: 'Свайные и шпунтовые работы'}, {id: 'UPV03', name: 'Земляные работы'},
    {id: 'UPV04', name: 'Благоустройство'}, {id: 'UPV05', name: 'Ограждение территории и внутренних сооружений'},
    {id: 'UPV06', name: 'Бетонные работы'}, {id: 'UPV07', name: 'Возведение купольных конструкций'},
    {id: 'UPV08', name: 'Монтаж металлоконструкций'}, {id: 'UPV09', name: 'Монтаж оборудования'},
    {id: 'UPV10', name: 'Наружные инженерные сети и коммуникации'}, {id: 'UPV11', name: 'Внутренние инженерные сети и оборудование'},
    {id: 'UPV12', name: 'Наружные электротехнические сети'}, {id: 'UPV13', name: 'Внутренние электротехнические сети и оборудование'},
    {id: 'UPV14', name: 'Наружные слаботочные сети'}, {id: 'UPV15', name: 'Внутренние слаботочные сети'},
    {id: 'UPV16', name: 'АСУ ТП'}, {id: 'UPV17', name: 'Возведение зданий и сооружений'},
    {id: 'UPV20', name: 'Прочие работы'}
  ];

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private modalService: NgbModal,
    private configService: ConfigService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.buildingForm = this.formBuilder.group({
      code: [''],
      name: ['']
    });
    this.userForm = this.formBuilder.group({
      login: [''],
      username: [''],
      userSurName: [''],
      isFirstFlag: [''],
      role: ['']
    });
    this.userUpdateForm = this.formBuilder.group({
      login: [''],
      userName: [''],
      userSurName: [''],
      isFirstName: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    //
    this.titleService.setTitle(this.title);
    //
    if (this.router.url === '/config') {
      this.dataService.addPageData(this.title);
      this.dataService.pageDataEmit();
    }
    // Проверка поля expires
    this.authService.lsExpiresHandler('check', 'update');
    this.getBuildings();
    this.getUsers();
  }

  modalHandler(content) {
    this.modalService.open(content, {centered: true, windowClass: 'customModalClass'});
  }

  hideSvg(elementId) {
    document.getElementById(elementId).setAttribute('class', 'flex-table-row-r-container del-svg del-svg-hide');
  }

  showSvg(elementId) {
    document.getElementById(elementId).setAttribute('class', 'flex-table-row-r-container del-svg del-svg-show');
  }

  showAddUserModal(content) {
    this.modalService.open(content, {centered: true, windowClass: 'customModalClass'});
  }

  // Получение списка сооружений
  getBuildings() {
    this.configService.postGetBuildings().subscribe(
      (response) => {
        this.buildingArr = JSON.parse(JSON.stringify(response, null, 1));
        console.log(this.buildingArr);
      },
      (error) => console.log('config.component.ts: ' + error)
    );
  }
  // Получение списка пользователей
  getUsers() {
    this.configService.postGetUsers().subscribe(
      (response) => {
        this.userArr = JSON.parse(JSON.stringify(response, null, 1));
        console.log(this.userArr);
        for (let i = 0; i < this.userArr.length; i++) {
          this.userMap.set(this.userArr[i].id, this.userArr[i]);
        }
        this.userRoleHandler();
      },
      (error) => console.log('config.component.ts: ' + error)
    );
  }

  // Обновление шаблона
  refreshData(varCondition) {
    if (varCondition === 'usersCondition') {
      this.usersCondition = false;
      this.getBuildings();
      this.getUsers();
    }
  }

  userRoleHandler() {
    this.configService.postGetAllRoles().subscribe(
      (response) => {
        const userRoleArr = JSON.parse(JSON.stringify(response, null, 1));

        for (const tempData of userRoleArr) {
          this.allRoleMap.set(tempData.id, tempData.name);
          this.allNameRoleMap.set(tempData.name, tempData.id);
        }

        // this.allRoleArr.push(userRoleArr);
      },
      (error) => console.log('config.component.ts: ' + error)
    );

    for (const i of this.userArr ) {
      // Получение ролей пользователей
      this.configService.postGetUserRole(i.id).subscribe(
        (response) => {
          const userRoleArr = JSON.parse(JSON.stringify(response, null, 1));
          // console.log(userRoleArr);

          // this.userRoleArr.push(userRoleArr);

          for (const tempData of userRoleArr) {
            this.roleMap.set(i.id, tempData.id);
          }
          this.usersCondition = true;
        },
        (error) => console.log('config.component.ts: ' + error)
      );
    }

  }

  userRoleGet(varUserId) {
    return this.allRoleMap.get(this.roleMap.get(varUserId));
  }

  allRoleGet() {
    // todo ERROR Error: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
    return this.allRoleMap.values();
  }

  // Добавление пользователя
  addUser() {
  }

  // Удаление пользователя
  removeUser(varUserId) {
    console.log(varUserId);
    this.configService.postRemoveUser(varUserId).subscribe(
      (response) => console.log(response),
      (error) => console.log('config.component.ts: ' + error)
    );
    this.refreshData('usersCondition');
  }

  // Редактирование пользователя
  submitUpdateUser(varUserId) {
    const tempUser = this.userMap.get(parseInt(varUserId, 10));
    // Условия заполнения, если некоторые из полей не затронуты пользователем при редактировании
    if (this.userUpdateForm.value.id === undefined) { this.userUpdateForm.value.id = tempUser.id; }
    if (this.userUpdateForm.value.login === '') { this.userUpdateForm.value.login = tempUser.login; }
    if (this.userUpdateForm.value.userName === '') { this.userUpdateForm.value.userName = tempUser.name; }
    if (this.userUpdateForm.value.userSurName === '') { this.userUpdateForm.value.userSurName = tempUser.surname; }
    if (this.userUpdateForm.value.isFirstName === '') { this.userUpdateForm.value.isFirstName = tempUser.firstFlag; }
    //
    this.configService.postUpdateUser(
      this.userUpdateForm.value.id,
      this.userUpdateForm.value.login,
      this.userUpdateForm.value.userName,
      this.userUpdateForm.value.userSurName,
      this.userUpdateForm.value.isFirstName,
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Запрос был создан');
          break;
        case HttpEventType.UploadProgress:
          this.progress = 35;
          break;
        case HttpEventType.Response:
          console.log('Успешное обновление пользователя', event.body);
          if (this.userUpdateForm.value.role !== '') {
            // Установка роли
            this.setRole(this.userUpdateForm.value.id, this.allNameRoleMap.get(this.userUpdateForm.value.role));
          } else {
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
          }
      }
    });
  }

  selectUpdateHandler(varValue) {
    if (varValue) {
      this.userUpdateForm.value.role = varValue;
      this.userRoleUpdate = true;
    }
  }

  removeBuilding(varBuildingId) {
    console.log(varBuildingId);
    this.configService.postRemoveBuilding(varBuildingId).subscribe(
      (response) => console.log(response),
      (error) => console.log('config.component.ts: ' + error)
    );
  }

  submitAddBuilding() {
    //
    this.configService.postAddBuilding(
      this.buildingForm.value.code,
      this.buildingForm.value.name
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
          console.log('Получен ответ об успешной загрузке!', event.body);
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
      }
    });
  }

  submitAddUser() {
    if (this.userForm.value.role === '') {
      console.log('Ошибка роли.');
    }
    //
    this.configService.postAddUser(
      this.userForm.value.login,
      this.userForm.value.username,
      this.userForm.value.userSurName,
      this.userForm.value.isFirstFlag
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Запрос был создан');
          break;
        case HttpEventType.UploadProgress:
          this.progress = 20;
          break;
        case HttpEventType.Response:
          console.log('Успешное добавление польхователя', event.body);
          // Установка роли
          this.setRole(event.body, this.allNameRoleMap.get(this.userForm.value.role));
      }
    });
  }

  selectHandler(varValue) {
    if (varValue === '') {
      document.getElementById('formGroupDisplay').setAttribute('style', 'display: none;');
    } else {
      const tempUser = this.userMap.get(parseInt(varValue, 10));
      this.user.id = tempUser.id;
      this.user.login = tempUser.login;
      this.user.name = tempUser.name;
      this.user.surname = tempUser.surname;
      this.user.firstFlag = tempUser.firstFlag;

      document.getElementById('formGroupDisplay').setAttribute('style', '');
    }
  }

  // Установка роли
  setRole(varUserId, varRoleId) {
    this.configService.postSetRole(varUserId, varRoleId).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          console.log(`Успех передачи данных ${this.progress}%`);
          break;
        case HttpEventType.Response:
          console.log('Успешное добавление роли', event.body);
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
      }
    });
  }
}
