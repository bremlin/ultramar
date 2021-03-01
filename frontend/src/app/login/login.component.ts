import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {CryptService} from '../services/crypt.service';
import {AuthService} from '../services/auth.service';

export class User {
  userName: string;
  passWord: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('login', {static: true}) login: ElementRef;
  @ViewChild('password', {static: true}) password: ElementRef;

  user: User = new User();
  disabled = 'disabled';
  authData;
  message = 'Неверный логин или пароль';

  constructor(
    private dataService: DataService,
    private router: Router,
    private httpService: AuthService,
    private cryptService: CryptService
  ) {
  }

  ngOnInit(): void {
  }

  checkUser() {
    this.httpService.postLoginData(this.login.nativeElement.value, this.password.nativeElement.value).subscribe(
      (response) => {
        this.authData = JSON.parse(JSON.stringify(response, null, 1));
        console.log(this.authData);
        this.loginStage1(this.authData);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loginStage1(varAuthData) {
    if (varAuthData.id > 0) {
      const varUniqueKey = this.httpService.getUniqueKey();
      const varExpires = new Date();
      varExpires.setMinutes(varExpires.getMinutes() + 30);

      // Запрос на права
      this.loginStage2(varAuthData);

      // Добавление данных в локальное хранилище
      localStorage.setItem('id', varAuthData.id);
      localStorage.setItem('login', varAuthData.login);
      localStorage.setItem('userName', varAuthData.name);
      localStorage.setItem('surName', varAuthData.surname);
      const varPassword = this.cryptService.set(varUniqueKey, this.password.nativeElement.value);
      localStorage.setItem('password', this.cryptService.set(varUniqueKey, varPassword));
      const varDate = this.cryptService.set(varUniqueKey, varExpires);
      localStorage.setItem('expires', varDate);

      //
      document.getElementById('message-box').setAttribute('style', 'display: none;');

      // Перенаправление к основному контенту
      this.router.navigate(['./dashboard']).then(r => {
      });

    } else {
      // this.message = 'Error';
      document.getElementById('message-box').setAttribute('style', 'display: block;');
    }
  }

  loginStage2(varAuthData) {
    this.httpService.postUserRole(this.login.nativeElement.value, this.password.nativeElement.value, varAuthData.id).subscribe(
      (response) => {
        const userRole = JSON.parse(JSON.stringify(response, null, 1));
        localStorage.setItem('userRoles', JSON.stringify(response, null, 1));
        if (userRole[0].id === 1) {
          this.httpService.userRoleAdd('admin');
        } else if (userRole[0].id === 2) {
          this.httpService.userRoleAdd('portalUser');
        }
        this.httpService.userRoleEmit();
        this.httpService.userNameEmit();
      },
      (error) => {
        console.log(error);
      }
    );
  }

}
