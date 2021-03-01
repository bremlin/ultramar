import { Component, OnInit } from '@angular/core';
import { DataService } from './data.service';
import {Router} from '@angular/router';
import {HttpService} from './services/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css' ]
})
export class AppComponent implements OnInit {

  title = 'godnoskop';

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: HttpService
  ) {
  }

  ngOnInit(): void {
  }

}
