import { Component, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { UserInsightService } from '../services/user-insight.service';

@Component({
  selector: 'app-user-insight',
  templateUrl: './user-insight.component.html',
  styleUrls: ['./user-insight.component.scss']
})
export class UserInsightComponent implements OnInit {

  insightName = 'Internal User Insight';
  view = 'graph';
  quarters = ['Q1FY', 'Q2FY', 'Q3FY', 'Q4FY'];
  monthlyList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  years = [2020, 2019, 2018];
  yearDp = false;
  durationDp = false;
  selectedYear = (new Date()).getFullYear();
  selectedDuraton = 'Q1FY20';
  showLoader = false;
  data = [];
  quaterData: any;
  config: any;
  legends = [
    {
      color: '#0E709E',
      label : 'IB Ops'
    },
    {
      color: '#67C1BA',
      label : 'Sales'
    },
    {
      color: '#C3CE3D',
      label : 'CX'
    },
    {
      color: '#9F94C5',
      label : 'Marketing'
    },
  ];
  constructor(public managementDbService: UserInsightService,
              public titleCase: TitleCasePipe,
              ) { }

  ngOnInit() {
    this.showAppLoader();
    const allQuartersData =  'assets/user-insight.json';
    this.managementDbService.get(allQuartersData).subscribe(response => {
      this.alterResponse(response);
    }, err => {
      this.hideAppLoader();
    }, () => {
      this.hideAppLoader();
    });
  }

  onSelection(duration) {
    const year = this.selectedYear.toString().slice(2, 4);
    this.selectedDuraton  = duration + year;
    this.filterData(duration, year);
  }

  filterData(duration, year) {
    const q1 = 'q1fy' + year;
    const q2 = 'q2fy' + year;
    const q3 = 'q3fy' + year;
    const q4 = 'q4fy' + year;
    let labels = [];
    let val = '';
    let selectQuarter = '';

    switch (duration) {

      case 'Q1FY':
        labels = ['aug', 'sep', 'oct'];
        val = 'q1';
        selectQuarter = q1;
        break;
      case 'Q2FY':
        labels = ['nov', 'dec', 'jan'];
        val = 'q2';
        selectQuarter = q2;
        break;
      case 'Q3FY':
        labels = ['feb', 'mar', 'apr'];
        val = 'q3';
        selectQuarter = q3;
        break;
      case 'Q4FY':
        labels = ['may', 'jun', 'jul'];
        val = 'q4';
        selectQuarter = q4;
        break;
    }

    const mData = this.quaterData.filter(ele => {
      if (ele.year === this.selectedYear && ele.quarter === selectQuarter) {
        return labels.includes(ele.label);
      }
    });

    if (mData.length > 0) {
      this.data = mData;
    } else {
      this.data = [];
    }
  }

  onYearSelection(year) {
    this.selectedYear = year;
    this.onSelection('Q1FY');
  }

  isMenuOpen(dp) {
    if (dp === 'year') {
      this.yearDp = true;
    } else {
      this.durationDp = true;
    }
  }

  isMenuClosed(dp) {
    if (dp === 'year') {
      this.yearDp = false;
    } else {
      this.durationDp = false;
    }
  }

  showAppLoader() {
    this.showLoader = true;
  }

  hideAppLoader() {
     setTimeout(() => {
      this.showLoader = false;
     }, 2000);
  }


  alterResponse(response) {

    this.selectedYear = response.data[0].year;
    this.selectedDuraton = response.data[0].quarter.toUpperCase();
    this.quaterData  = this.managementDbService.changeKeys(response.data, 'month', true);

    this.data = this.quaterData.map(el => {
      return {
        label: el.label,
        year: el.year,
        quarter: el.quarter,
        ibOps: el.ibOps,
        sales: el.sales,
        cx: el.cx,
        marketing : el.marketing,
      };
    });

    this.quaterData  = this.data;
    this.onSelection('Q1FY');
}

  toggle() {
    (this.view === 'graph') ? this.view = 'list' : this.view = 'graph';
  }

  getSum(val: string) {
    const value =  this.data.reduce((x, y) => x + y[val], 0);
    return this.managementDbService.transform(value, 1);
    }
}
 