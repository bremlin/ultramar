import {Component, OnInit} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {Chart} from 'chart.js';
import {DataService} from '../data.service';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {DashboardService} from '../services/dashboard.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';
import * as moment from 'moment';
import {DataSet, Timeline} from 'vis';
import { ContextMenuModule } from 'ngx-contextmenu';
import {MatCardModule} from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
// import {stripColors } from 'colors';
import { Subject } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import {FormGroup} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    ContextMenuModule.forRoot({
      useBootstrap4: true,
    }),
    // DemoUtilsModule,
  ],
  // declarations: [DemoComponent],
  exports: [MatCardModule]
})
export class MyModule {}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DashboardService],
})
export class DashboardComponent implements OnInit {

  mainTitle = 'Godnoskop Manage Portal';

  condition = true;
  selectedKey: string;


  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService,
) {
  }

  today: number = Date.now();
  keyWidgetData = [];
  keyWidgetNames = new Set();
  volWidgetData = [];
  volChart: Chart;
  volChartColorMap = new Map();
  volChartElemMap = new Map();
  keyChart: Timeline;
  keyChartItems;
  keyChartCondition = true;
  keyChartOptions;
  keyChartContainer;
  smrChart: Chart;
  keyWidgetDiscipline = new Set();
  keyWidgetValues = new Map();
  smrWidgetValues = new Map();
  targetSmrWidgetElem;
  targetObjectName;
  targetPlanResidue = 0;
  targetFactResidue = 0;
  targetDeviation = 0;
  targetPlan = 0;
  targetFact = 0;
  deviationStart = 0;
  deviationEnd = 0;
  volChartBgColor = ['#9cc2e3', '#8ea8d8', '#3374b1'];
  volChartBgColorP = ['#cbeeff', '#c4d7ff', '#42c5ff'];
  volChartCondition = true;
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  eventsLoad = [];
  event;
  date;

  // events: CalendarEvent[] = [
  //   {
  //     start: new Date(),
  //     title: 'A 3 day event',
  //     draggable: true,
  //   }
  // ];
  events: CalendarEvent[] = [];

  refresh: Subject<any> = new Subject();

  eventClicked({ event }: { event: CalendarEvent }): void {
    console.log('Event clicked', event);
  }
  addEvent(date: Date): void {
    console.log(date);
    // this.events.push({
    //   start: date,
    //   title: 'New event',
    // });
    // this.refresh.next();
  }
  ngOnInit(): void {
    this.dashboardService.postGetGorikQuery().subscribe(
      (response) => {
        this.eventsLoad = JSON.parse(JSON.stringify(response, null, 1));
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.eventsLoad.length; i++) {
          this.date = new Date(this.eventsLoad[i].gorikDate);
          this.events.push({
            start: this.date,
            title: this.eventsLoad[i].userName
          });
          if (this.date === this.viewDate) {
            this.event = this.events[this.events.length - 1];
          }
        }
        this.refresh.next();
        console.log(this.eventsLoad);

      },
      (error) => console.log('config.component.ts: ' + error)
    );
    this.refresh.next();
    //
    this.titleService.setTitle(this.mainTitle);
    //
    if (this.router.url === '/dashboard') {
      this.dataService.addPageData(this.mainTitle);
      this.dataService.pageDataEmit();
    }
    // Проверка поля expires
    this.authService.lsExpiresHandler('check', 'update');
    //
    this.volChartColorMap.set(0, '#9cc2e3');
    this.volChartColorMap.set(1, '#8ea8d8');
    this.volChartColorMap.set(2, '#3374b1');
    // Виджет VOL
    console.log('loadquery');
    // this.dashboardService.postGetGorikQuery().subscribe((event: HttpEvent<any>) => {
    //     if (event.type === HttpEventType.Response) {
    //       console.log('is ok');
    //       this.eventsLoad = event.body;
    //       console.log(this.eventsLoad);
    //     }
    //   }, (error) => {
    //     console.log(error);
    //   }
    // );

    // this.dashboardService.postVolData().subscribe((event: HttpEvent<any>) => {
    //     if (event.type === HttpEventType.Response) {
    //       this.volWidgetData = event.body;
    //
    //       for (const i of this.volWidgetData) {
    //         this.keyWidgetNames.add(i.objectName);
    //         this.keyWidgetDiscipline.add(i.disciplineName);
    //         if (this.keyWidgetValues.has(i.disciplineName)) {
    //           this.keyWidgetValues.get(i.disciplineName).push(i.factPercent);
    //         } else {
    //           const array = [];
    //           array.push(i.factPercent);
    //           this.keyWidgetValues.set(i.disciplineName, array);
    //         }
    //       }
    //
    //       const typeVol = Array.from(this.keyWidgetNames.keys());
    //
    //       this.volChart = new Chart(document.getElementById('vol-chart'), {
    //         type: 'bar',
    //         data: {
    //           labels: Array.from(typeVol),
    //           datasets: [{
    //               data: this.keyWidgetValues.get('ПИР'),
    //               backgroundColor: this.volChartBgColor[0],
    //               label: 'ПИР',
    //             },
    //             {
    //               data: this.keyWidgetValues.get('МТО'),
    //               backgroundColor: this.volChartBgColor[1],
    //               label: 'МТО',
    //             },
    //             {
    //               data: this.keyWidgetValues.get('СМР'),
    //               backgroundColor: this.volChartBgColor[2],
    //               label: 'СМР',
    //               fontFamily: 'customWebFont, customWebFont2, sans-serif'
    //             }],
    //         },
    //         options: {
    //           legend: {
    //             position: 'bottom',
    //             labels: {
    //               fontFamily: 'customWebFont, customWebFont2, sans-serif'
    //             }
    //           },
    //           barWidth: 50,
    //           responsive: true,
    //           maintainAspectRatio: false,
    //           scales: {
    //             yAxes: [{
    //               ticks: {
    //                 beginAtZero: true,
    //                 min: 0,
    //                 max: 100,
    //                 fontFamily: 'customWebFont, customWebFont2, sans-serif'
    //               }
    //             }],
    //             xAxes: [{
    //               display: true,
    //               gridLines: {
    //                 drawBorder: true,
    //                 display: false
    //               },
    //               ticks: {
    //                 fontFamily: 'customWebFont, customWebFont2, sans-serif'
    //               }
    //             }]
    //           }
    //           // onClick: () => {}
    //         }
    //       });
    //     }
    //     this.volChartCondition = false;
    //   }, (error) => {
    //     console.log(error);
    //   }
    // );
    // // Виджет SMR
    // this.dashboardService.postSmrData().subscribe((event: HttpEvent<any>) => {
    //     if (event.type === HttpEventType.Response) {
    //
    //       for (const i of event.body) {
    //         this.smrWidgetValues.set(i.objectName, i);
    //       }
    //       this.targetSmrWidgetElem = event.body;
    //       // Запись начального имени объекта
    //       this.targetObjectName = this.targetSmrWidgetElem[0].objectName;
    //       // Запись начального отклонения
    //       this.targetDeviation = this.targetSmrWidgetElem[0].deviationPercent;
    //       // Запись начального ПЛАН ФАКТ
    //       this.targetPlan = this.targetSmrWidgetElem[0].planPercent;
    //       this.targetFact = this.targetSmrWidgetElem[0].factPercent;
    //       // Вычисление начального остатка
    //       this.targetPlanResidue = 100 - this.targetPlan;
    //       this.targetFactResidue = 100 - this.targetFact - -this.targetDeviation;
    //       // Отрисовка SMR chart
    //       this.drawSmrChart();
    //     }
    //   }, (error) => {
    //     console.log(error);
    //   }
    // );
    // // Виджет KEY
    // this.dashboardService.postKeyData().subscribe((event: HttpEvent<any>) => {
    //     if (event.type === HttpEventType.Response) {
    //       this.keyWidgetData = event.body;
    //
    //       // DOM element where the Timeline will be attached
    //       this.keyChartContainer = document.getElementById('key-chart-container');
    //       // Create a DataSet (allows two way data-binding)
    //       this.keyChartItems = new DataSet([
    //         {id: 1, content: 'Старт работ', start: '12-12-2019'},
    //         {id: 2, content: 'Окончание работ', start: '12-12-2020'},
    //       ]);
    //       // Configuration for the Timeline
    //       this.keyChartOptions = {
    //         locale: 'ru',
    //         showCurrentTime: false
    //       };
    //       // Create a Timeline
    //       this.keyChart = new Timeline(this.keyChartContainer, this.keyChartItems, this.keyChartOptions);
    //       this.keyChartCondition = false;
    //     }
    //   }, (error) => {
    //     console.log(error);
    //   }
    // );
    this.init();
  }

  selectDay(key: string) {
    this.selectedKey = key;
  }

  showData(event: any) {
    const data = this.volChart.getElementsAtEvent(event);
    // Обработка undefined
    if (data[0] === undefined) {
      return;
    }

    // Обработка графика VOL
    this.volChartHandler(data).then(r => {
      this.volChart.update();
    });

    const tempArrElem = this.targetSmrWidgetElem.filter(e => e.objectName === data[0]._model.label);
    // Изменнние имени объекта
    this.targetObjectName = tempArrElem[0].objectName;
    // Запись отклонения
    this.targetDeviation = tempArrElem[0].deviationPercent;
    // Вычисление остатков
    this.targetPlanResidue = 100 - tempArrElem[0].planPercent;
    this.targetFactResidue = 100 - tempArrElem[0].factPercent - -this.targetDeviation;
    // Запись ПЛАН ФАКТ
    this.targetPlan = tempArrElem[0].planPercent;
    this.targetFact = tempArrElem[0].factPercent;
    // Обработка графика SMR
    // Установка значений первому датасету ПЛАН
    this.smrChart.data.datasets[0].data[0] = this.targetPlan.toFixed(2);
    this.smrChart.data.datasets[0].data[1] = this.targetPlanResidue.toFixed(2);
    // Установка значений второму датасету ФАКТ
    this.smrChart.data.datasets[1].data[0] = this.targetFact.toFixed(2);
    this.smrChart.data.datasets[1].data[1] = this.targetDeviation.toFixed(2);
    this.smrChart.data.datasets[1].data[2] = this.targetFactResidue.toFixed(2);
    // Обновление
    this.smrChart.update();

    const tempKeyArrElem = this.keyWidgetData.filter(e => e.objectName === data[0]._model.label);
    // Обработка графика KEY
    // Запись отклонений
    this.deviationStart = tempKeyArrElem[0].deviationStart;
    this.deviationEnd = tempKeyArrElem[0].deviationEnd;
    // Изменение цвета в зависимости от отклонения
    let tempDeviationStartColor;
    let tempDeviationEndColor;
    if (this.deviationStart >= 0) {
      tempDeviationStartColor = 'var(--green)';
    } else {
      tempDeviationStartColor = 'var(--danger)';
    }
    if (this.deviationEnd >= 0) {
      tempDeviationEndColor = 'var(--green)';
    } else {
      tempDeviationEndColor = 'var(--danger)';
    }
    //
    const items = [
      {
        id: 1,
        content:
          '<table style="font-size: 0.8rem;">' +
          '    <tr>' +
          '        <td style="font-weight: 700;">Старт работ</td>' +
          '    </tr>' +
          '    <tr>' +
          '        <td style="font-weight: 700;">' + this.targetObjectName + '</td>' +
          '    </tr>' +
          '    <tr>' +
          '        <td style="font-weight: 700; color: ' + tempDeviationStartColor + ';">' +
                    tempKeyArrElem[0].deviationStart.toString() + ' дней</td>' +
          '    </tr>' +
          '</table>',
        start: moment(tempKeyArrElem[0].tpStart.toString(), 'DD-MM-YYYY').format('MM-DD-YYYY')
      },
      {
        id: 2,
        content:
          '<table style="font-size: 0.8rem;">' +
          '    <tr>' +
          '        <td style="font-weight: 700;">Окончание работ</td>' +
          '    </tr>' +
          '    <tr>' +
          '        <td style="font-weight: 700;">' + this.targetObjectName + '</td>' +
          '    </tr>' +
          '    <tr>' +
          '        <td style="font-weight: 700; color: ' + tempDeviationEndColor + ';">' +
                    tempKeyArrElem[0].deviationEnd.toString() + ' дней</td>' +
          '    </tr>' +
          '</table>',
        start: moment(tempKeyArrElem[0].tpEnd.toString(), 'DD-MM-YYYY').format('MM-DD-YYYY')
      },
      {
        id: 3,
        content: '_',
        className: 'plan',
        start: moment(tempKeyArrElem[0].tpStart.toString(), 'DD-MM-YYYY').format('MM-DD-YYYY'),
        end: moment(tempKeyArrElem[0].tpEnd.toString(), 'DD-MM-YYYY').format('MM-DD-YYYY')
      },
      {
        id: 4,
        content: 'ФАКТ: ' + tempKeyArrElem[0].dateEnd.toString(),
        className: 'fact',
        start: moment(tempKeyArrElem[0].dateStart.toString(), 'DD-MM-YYYY').format('MM-DD-YYYY'),
        end: moment(tempKeyArrElem[0].dateEnd.toString(), 'DD-MM-YYYY').format('MM-DD-YYYY')
      },
    ];
    //
    this.keyChartItems.update(items);
    //
    this.keyChart.focus([1, 2]);
  }

  volChartHandler(data) {
    if (this.volChartElemMap.size > 0) {
      for (const i of this.volChartElemMap.values()) {
        i.custom = i.custom || {};
        i.custom.backgroundColor = this.volChartBgColor[i._datasetIndex];
      }
    }
    return new Promise((resolve, reject) => {
      this.volChartBgHandler(data).then(r => {
        resolve(r);
      });
    });
  }
  async volChartBgHandler(data) {
    this.volChartElemMap.clear();
    for (const i of data) {
      i.custom = i.custom || {};
      i.custom.backgroundColor = this.volChartBgColorP[i._datasetIndex];
      this.volChartElemMap.set(i._datasetIndex, i);
    }
    return 'COMPLETE';
  }

  drawSmrChart() {
    const draw = Chart.controllers.doughnut.prototype.draw;
    Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
      draw() {
        draw.apply(this, arguments);
        const ctx = this.chart.chart.ctx;
        const _fill = ctx.fill;
        ctx.fill = function() {
          ctx.save();
          ctx.shadowColor = 'rgba(0,206,207,0.3)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 0;
          _fill.apply(this, arguments);
          ctx.restore();
        };
      }
    });

    const data = {
      datasets: [
        {
          data: [
            this.targetPlan.toFixed(2),
            this.targetPlanResidue.toFixed(2)
          ],
          backgroundColor: [
            '#6c757d',
            '#f0f0f0'
          ],
          label: ['ПЛАН', 'ОСТАТОК'],
        },
        {
          data: [
            this.targetFact.toFixed(2),
            this.targetDeviation.toFixed(2),
            this.targetFactResidue.toFixed(2)
          ],
          backgroundColor: [
            '#165aa9',
            '#dc3545',
            '#f0f0f0'
          ],
          label: ['ФАКТ', 'ОТКЛОНЕНИЕ', 'ОСТАТОК'],
        }
      ],
      labels: [
        'ПЛАН',
        'ФАКТ'
      ]
    };

    this.smrChart = new Chart(document.getElementById('smr-chart'), {
      type: 'doughnut',
      data,
      options: {
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        maintainAspectRatio: true, // При изменении размера сохраняет исходное соотношение сторон холста (ширина / высота)
        aspectRatio: 1,
        title: {
          display: false,
          text: 'Выполнение физобъёмов, %'
        },
        responsive: true,
        legend: {
          display: false,
          position: 'top',
        },
        tooltips: {
          callbacks: {
            label: (item, data) => {
              return data.datasets[item.datasetIndex].label[item.index] + ': '
                + data.datasets[item.datasetIndex].data[item.index] + ' %';
            }
          }
        }
      },
      // plugins: {
      //   beforeDraw(chart) {
      //     const width = chart.chart.width, height = chart.chart.height, ctx = chart.chart.ctx;
      //     ctx.restore();
      //     const fontSize = '2rem';
      //     ctx.font = '0.75rem customWebFont';
      //     ctx.fillStyle = 'rgb(102, 102, 102)';
      //     ctx.textBaseline = 'middle';
      //
      //     let text = data.labels[0] + ' ' + data.datasets[0].data[0] + '%',
      //       textX = Math.round((width - ctx.measureText(text).width) / 2),
      //       textY = height / 2;
      //
      //     ctx.fillText(text, textX, textY - 3);
      //     ctx.fillText(data.labels[1] + ' ' + data.datasets[1].data[0] + '%', textX, textY + textY / 8);
      //     ctx.save();
      //   }
      // }
    });
  }

  init() {
    // document.addEventListener('DOMContentLoaded', barChartHorizontal2);
    // promisedDeliveryChart.update();
    // this.volChart.update();
    // barChartHorizontal.update();
    // barChartHorizontal2.update();
  }

}
