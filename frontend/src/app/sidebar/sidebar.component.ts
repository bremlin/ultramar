import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {HttpService} from '../services/http.service';
import {CryptService} from '../services/crypt.service';
import {AuthService} from '../services/auth.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  change = false;
  user;
  @Input() role;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.authService.data3Change.subscribe(data => {
      // Если localStorage пустой
      if (data == null) {
        this.role = 'NaN';
        return false;
      }
      console.log(data);
      // Если в localStorage есть данные
      const varNumberRole = JSON.parse(data);
      if (varNumberRole[0].id === 1) {
        this.role = 'admin';
      } else if (varNumberRole[0].id === 3) {
        this.role = 'portalUser';
      }
    });
    // Если ролей не обнаружено
    if (this.role === undefined) {
      this.authService.userRoleEmit();
    }
  }

  toggleMenu(event, state) {
    if (state === true) {
      document.getElementById('wrapper').setAttribute('class', 'd-flex toggled');
    } else if (state === false) {
      document.getElementById('wrapper').setAttribute('class', 'd-flex');
    } else {
      console.log('Error');
    }
  }
}
