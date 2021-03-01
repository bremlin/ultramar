import {Component, Input, OnInit} from '@angular/core';
import { DataService } from '../data.service';
import {Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import {CookieService} from 'ngx-cookie-service';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Input() userName;
  @Input() userSurname;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  pageTitle = 'Рабочий стол';

  ngOnInit(): void {
    this.dataService.dataChange.subscribe(data => {
      this.pageTitle = data;
    });
    this.authService.userNameChange.subscribe(data => {
      this.userName = data;
      this.userSurname = data;
    });
    if (this.userName === undefined ) {
      this.authService.userNameEmit();
    }
  }

  dropdownItemEnter() {
    document.getElementById('exit').setAttribute('class', 'dropdown-item dropdown-item-enter');
  }

  dropdownItemLeave() {
    document.getElementById('exit').setAttribute('class', 'dropdown-item dropdown-item-leave');
  }

  logout() {
    this.authService.userRoleClear();
    localStorage.clear();
    this.router.navigate(['./login']).then(r => {});
  }

}
