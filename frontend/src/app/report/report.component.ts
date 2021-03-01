import {Component, ContentChild, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {DataService} from '../data.service';
import {Title} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {ReportService} from '../services/report.service';
import {AuthService} from '../services/auth.service';
import {HttpEvent, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [ReportService]
})
export class ReportComponent implements OnInit, OnDestroy {

  title = 'Отчёты';
  frontendData = {stages: null};

  lastElem;
  testArr;
  testMap = new Map();
  responseArr;
  reportArr = [];
  rootElements = new Array();

  constructor(
    private dataService: DataService,
    private titleService: Title,
    private router: Router,
    private reportService: ReportService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    //
    this.titleService.setTitle(this.title);
    //
    if (this.router.url === '/report') {
      this.dataService.addPageData(this.title);
      this.dataService.pageDataEmit();
    }
    //
    this.reportService.postReportData().subscribe(
      (response) => {
        localStorage.setItem('reportInvestData', JSON.stringify([response.body]));
        this.frontendData.stages = JSON.parse(localStorage.getItem('reportInvestData'));
      },
      (error) => {
        console.log(error);
      }
    );
    //
    this.reportService.postSumStructureReportData().subscribe((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          this.responseArr = event.body;
          // console.log(event.body);

          // Массив-корень узлов верхнего уровня
          const tempRoot = [];
          // Кэш для поиска родительских индексов
          const tempMap = {};

          this.responseArr.forEach(node => {
            // Если нет parentId, то это означает верхний уровень
            if (!node.parentId) {
              this.rootElements.push(node);
              return tempRoot.push(node);
            }
            // Вставка узла как потомка родителя в responseArr
            let parentIndex = tempMap[node.parentId];
            if (typeof parentIndex !== 'number') {
              parentIndex = this.responseArr.findIndex(e => e.id === node.parentId);
              tempMap[node.parentId] = parentIndex;
            }
            if (!this.responseArr[parentIndex].children) {
              return this.responseArr[parentIndex].children = [node];
            }
            this.responseArr[parentIndex].children.push(node);
          });

          this.reportArr = tempRoot;

        }
      }, (error) => {
        console.log(error);
      }
    );
    localStorage.setItem('reportRowState', JSON.stringify([]));
    // Проверка поля expires
    this.authService.lsExpiresHandler('check', 'update');
  }

  setLevel(level) {
    console.log('test');
  }

  ngOnDestroy(): void {
    // Очистка localStorage от временных переменных
    localStorage.removeItem('reportRowState');
    localStorage.removeItem('reportInvestData');
  }

  changeStateSecondReport(varState) {
    for (const rootElement of this.rootElements) {
      if (varState === 'showAll') {
        this.elementExpandAll(rootElement);
      } else if (varState === 'hideAll') {
        this.elementCollapseAll(rootElement);
      }
    }
  }

  expandHandler(varState) {
    if (varState === 'showAll') {
      const varElements = this.frontendData.stages[0].filter(e => e.parentId === 0);
      for (let varElement of varElements) {
        let nextFilter;
        nextFilter = this.frontendData.stages[0].filter(e => e.parentId === varElement.id);
        this.stageChangeSvg(varElement, varState);
        this.subStageChange(nextFilter, true, 1);
        for (let lastLevel of nextFilter) {
          let lastFilter;
          lastFilter = this.frontendData.stages[0].filter(e => e.parentId === lastLevel.id);
          this.stageChangeSvg(lastLevel, varState);
          this.subStageChange(lastFilter, true, 2);
        }
      }
    } else if (varState === 'hideAll') {
      const varElements = this.frontendData.stages[0].filter(e => e.parentId === 0);
      for (let varElement of varElements) {
        let nextFilter;
        nextFilter = this.frontendData.stages[0].filter(e => e.parentId === varElement.id);
        this.stageChangeSvg(varElement, varState);
        this.subStageChange(nextFilter, false, 1);
        for (let lastLevel of nextFilter) {
          let lastFilter;
          lastFilter = this.frontendData.stages[0].filter(e => e.parentId === lastLevel.id);
          this.stageChangeSvg(lastLevel, varState);
          this.subStageChange(lastFilter, false, 2);
        }
      }
    }
  }

  // Фильтрация 3-го уровня вложенности
  filterForStage3(varId) {
    return this.frontendData.stages[0].filter(e => e.parentId === varId);
  }

  // Фильтрация 2-го уровня вложенности
  filterForStage2(varParentId) {
    let varFiltered;
    varFiltered = this.frontendData.stages[0].filter(e => e.parentId === 0);
    let nextFilter;
    nextFilter = varFiltered.filter(e => e.id === varParentId);
    return nextFilter.length > 0;
  }

  // Фильтрация 1-го уровня вложенности
  filterForStage1(varParentId) {
    let varFiltered;
    varFiltered = this.frontendData.stages[0].filter(e => e.id === varParentId);
    let nextFilter;
    nextFilter = varFiltered.filter(e => e.id = varParentId);
    return nextFilter[0].name;
  }

  // Функция изменения состояния элементов
  elementStateChange(item) {
    if (item.parentId === 0) {
      const show = document.getElementById(item.id).getAttribute('show');
      if (show == null || show === '0') {
        document.getElementById(item.id).setAttribute('show', '1');
      } else {
        document.getElementById(item.id).setAttribute('show', '0');
        for (const child of item.children) {
          this.elementCollapseAll(child);
        }
      }
    }
    let level = 0;
    if (document.getElementById(item.id).getAttribute('level') != null) {
      level = parseInt(document.getElementById(item.id).getAttribute('level'), 10);
    }

    level++;

    for (const child of item.children) {
      document.getElementById(child.id).setAttribute('level', level.toString());

      const show = document.getElementById(child.id).getAttribute('show');
      if (show == null || show === '0') {
        document.getElementById(child.id).setAttribute('show', '1');
        document.getElementById(child.id).setAttribute('class', 'childItemShow' + level.toString());
      } else {
        document.getElementById(child.id).setAttribute('show', '0');
        document.getElementById(child.id).setAttribute('class', 'childItemHide');
        if (child.children?.length > 0) {
          this.elementCollapseAll(child);
        }
      }
    }
  }

  // Функция схлопывания всех child
  elementCollapseAll(item) {
    for (const child of item.children) {
      if (child.children?.length > 0) {
        this.elementCollapseAll(child);
      }
      document.getElementById(child.id).setAttribute('show', '0');
      document.getElementById(child.id).setAttribute('class', 'childItemHide');
    }
  }

  // Функция раскрытия всех child
  elementExpandAll(item) {
    let level = 0;
    if (document.getElementById(item.id).getAttribute('level') != null) {
      level = parseInt(document.getElementById(item.id).getAttribute('level'), 10);
    }

    level++;

    for (const child of item.children) {
      if (child.children?.length > 0) {
        this.elementExpandAll(child);
      }
      document.getElementById(child.id).setAttribute('level', level.toString());

      const show = document.getElementById(child.id).getAttribute('show');
      document.getElementById(child.id).setAttribute('show', '1');
      document.getElementById(child.id).setAttribute('class', 'childItemShow' + level.toString());
    }
  }

  // Главная функция по изменению состояния элемента
  stageChangeState(varElementId, varSubStage) {
    let varReportRowElement = [];
    let arrReportRowElement = [];
    arrReportRowElement = JSON.parse(localStorage.getItem('reportRowState'));
    varReportRowElement = arrReportRowElement.filter(e => e.id === varElementId);
    const index = varReportRowElement.length;
    // Проверка на существование элемента в массиве
    if (index > 0) {
      let varState = varReportRowElement[0].l as boolean;
      varState = !varState;

      const varElements = this.frontendData.stages[0].filter(e => e.parentId === varElementId);

      this.subStageChange(varElements, varState, varSubStage);
      for (let lastLevel of varElements) {
        let lastFilter = this.frontendData.stages[0].filter(e => e.parentId === lastLevel.id);
        if (lastFilter.length > 0 && varState === false) {
          this.subStageChange(lastFilter, varState, 2);
          this.stageChangeSvg(lastLevel, varState);
        }
      }
      const changeArray = (id, l) => {
        const item = arrReportRowElement.find(e => e.id === id);
        item.id = id;
        item.l = l;
        return true;
      };
      if (changeArray(varElementId, varState)) {
        localStorage.setItem('reportRowState', JSON.stringify(arrReportRowElement, null, 1));
      }
      return true;
    } else {
      const varState = true;

      const varElements = this.frontendData.stages[0].filter(e => e.parentId === varElementId);

      this.subStageChange(varElements, varState, varSubStage);
      const arrBody = {
        id: varElementId,
        l: varState
      };
      arrReportRowElement.push(arrBody);
      localStorage.setItem('reportRowState', JSON.stringify(arrReportRowElement, null, 1));
      return true;
    }
  }

  // Вторая функция (шаблонная) по изменению состояния элемента
  subStageChange(varElements, varStage, varSubStage) {
    for (const i of varElements) {
      if (varStage === false) {
        if (varSubStage === 2) {
          document.getElementById(i.parentId + i.parentId).setAttribute('style', 'display: none; background-color: #d9e1f2;');
        } else {
          this.stageChangeSvg(i, varStage);
          document.getElementById(i.parentId + i.id).setAttribute('style', 'display: none; background-color: #d9e1f2;');
        }
      } else if (varStage === true) {
        if (varSubStage === 1) {
          this.stageChangeSvg(i, varStage);
          document.getElementById(i.parentId + i.id).setAttribute('style', 'display: table-row; background-color: #d9e1f2;');
        } else {
          document.getElementById(i.parentId + i.parentId).setAttribute('style', 'display: table-row-group; background-color: #d9e1f2;');
        }
      }
    }
  }

  // Функция (шаблонная) по изменению состояния элемента svg
  stageChangeSvg(varElement, varStage) {
    let varElementId1;
    let varElementId0;
    if (varElement.parentId === 0) {
      varElementId1 = varElement.id + '1';
      varElementId0 = varElement.id + '0';
    } else {
      varElementId1 = varElement.parentId + '1';
      varElementId0 = varElement.parentId + '0';
    }
    if (varStage === true) {
      document.getElementById(varElementId0).setAttribute('style', '-ms-transform: rotate(360deg);' +
        '-webkit-transform: rotate(360deg);' +
        'transform: rotate(360deg);' +
        'cursor: pointer;' +
        'display: inline;');
      document.getElementById(varElementId1).setAttribute('style', '-ms-transform: rotate(360deg);' +
        '-webkit-transform: rotate(360deg);' +
        'transform: rotate(360deg);' +
        'cursor: pointer;' +
        'display: none;');
    } else {
      document.getElementById(varElementId0).setAttribute('style', '-ms-transform: rotate(360deg);' +
        '-webkit-transform: rotate(360deg);' +
        'transform: rotate(360deg);' +
        'cursor: pointer;' +
        'display: none;');
      document.getElementById(varElementId1).setAttribute('style', '-ms-transform: rotate(360deg);' +
        '-webkit-transform: rotate(360deg);' +
        'transform: rotate(360deg);' +
        'cursor: pointer;' +
        'display: inline;');
    }
  }

  childrenOfParent(varId) {
    for (let i of this.reportArr) {
      if (i.id === varId) {
        return i.children;
      }
    }
  }

  stageChangeStateNew(varId) {
    for (let i of this.reportArr) {
      if (i.id === varId) {
        console.log(i);
        for (let n of i.children) {
          document.getElementById(n.id).setAttribute('style', 'display: none; background-color: #d9e1f2;');
        }
      }
    }
  }

  printReport(varElement) {
    const varReportWindow = window.open('', 'PRINT', '');
    varReportWindow.document.write('<html><head><title>' + document.title + '</title>');
    varReportWindow.document.write('<link rel="stylesheet" type="text/css" href="../../styles.css">');
    varReportWindow.document.write('</head><body >');
    varReportWindow.document.write(document.getElementById(varElement).innerHTML);
    varReportWindow.document.write('</body></html>');
    varReportWindow.document.close(); // Необходимо для IE >= 10
    varReportWindow.focus(); // Необходимо для IE >= 10
    varReportWindow.print();
    varReportWindow.close();
    return true;
  }

}
