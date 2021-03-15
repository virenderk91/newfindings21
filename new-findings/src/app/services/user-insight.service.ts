import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Observable} from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserInsightService {

  httpOptions = {};

  constructor(private http: HttpClient) { }

  get(url: string): Observable<any> {
    return this.http.get(url)
      .pipe(catchError(err => {
        return throwError(err);
      }));

  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(url, body, this.httpOptions)
      .pipe(
        catchError(err => {
          return throwError(err);
        }));

  }

  changeKeys(data, duration? , skip?) {   // Change the Keys of Data Object for Make Common API Struture.
    let i;
    const quarter = 'quarter';
    const month = 'month';


    for (i = 0; i < data.length; i++) {
      if (!skip) {
        if (data[i].quarter !== undefined) {
          data[i].label = data[i][quarter];
          delete data[i].quarter;
        }
      }

      if (data[i].month !== undefined) {
        data[i].label = data[i][month];
        delete data[i][month];

      }
  }

    return data;
}

checkMonth(data, duration, year) {   // this methos is used for assign 0 value for non-existing month in the Months.
  const selyear = year;
  let x: any;
  let labels = [];
  switch (duration) {
    case '3months':
      labels = ['jan', 'feb', 'mar'];
      break;
    case '6months':
      labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun'];
      break;
    case '9months':
      labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep'];
      break;
      default:
      labels = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      break;
  }
  // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < labels.length; i++) {
    x = this.assignZero(data, i, labels, selyear, 'summary');
  }

  return x;

}

checkQuarterMonth(data, quarter, selyear) {  // this methos is used for assign 0 value for non-existing month in the Quarter.

  const ele = selyear.toString().slice(2, 4);
  let arr: any;
  let labels = [];
  const q1  = 'q1fy' + ele;
  const q2  = 'q2fy' + ele;
  const q3  = 'q3fy' + ele;
  const q4  = 'q4fy' + ele;

  switch (quarter) {
    case 'all':
      labels = [q1, q2, q3, q4];
      break;
    case 'q1':
      labels = ['aug', 'sep', 'oct'];
      break;
    case 'q2':
      labels = ['nov', 'dec', 'jan'];
      break;
    case 'q3':
      labels = ['feb', 'mar', 'apr'];
      break;
    case 'q4':
      labels = ['may', 'jun', 'jul'];
      break;
  }

  for (let i = 0; i < labels.length; i++) {
    arr = this.assignZero(data, i, labels, selyear, 'summary');
    }

  return arr;
}

checkYearData(data, years) {
  const currentYear = new Date().getFullYear();
  const selectedYear = currentYear - years;
  const res = [];
  for (let i = (selectedYear + 1); i <= currentYear; i++) {
    const yearArr = data.filter(x => x.year === i);
    const obj = {
      label: i.toString(),
      year: i,
      count: 0
    };
    if (yearArr.length) {
      obj.count = yearArr.reduce((val, o) => val + o.count, 0);
    }
    res.push(obj);
  }

  return res;
}

assignZero(arr, index, labels, selyear, from) { 
  const found = arr.some(el => el.label === labels[index]);
  if (!found) {
    if(from === 'forED') {
      arr.splice(index, 0, {
        label: labels[index],
        year: selyear,
        licenseDownloads: 0,
        orderFullfillments: 0,
        softwareDownloads: 0,
        oba: 0
      });

    } else {
      arr.splice(index, 0, {
        label: labels[index],
        year: selyear,
        count: 0
      });
    }
    }
  return arr ;
}

checkMonthED(data, duration, year) {   // this methos is used for assign 0 value for non-existing month in the Months.
  const selyear = year;
  let x : any;
  let labels = [];
  switch (duration) {
    case 'threeMonths':
      labels = ['JAN', 'FEB', 'MAR'];
      break;
    case 'sixMonths':
      labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
      break;
    case 'nineMonths':
      labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP'];
      break;
    case 'twelveMonths':
      labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      break;
  }
    // tslint:disable-next-line: prefer-for-of
  for (let i = 0; i < labels.length; i++) {
     x = this.assignZero(data, i, labels, selyear, 'forED');
    }

  return x;
}

checkQuarterMonthED(data, quarter, selyear) {
  const ele = selyear.toString().slice(2, 4);
  let arr: any;
  let labels = [];
  const q1  = 'q1fy' + ele;
  const q2  = 'q2fy' + ele;
  const q3  = 'q3fy' + ele;
  const q4  = 'q4fy' + ele;

  switch (quarter) {
    case 'all':
      labels = [q1, q2, q3, q4];
      break;
    case 'q1':
      labels = ['AUG', 'SEP', 'OCT'];
      break;
    case 'q2':
      labels = ['NOV', 'DEC', 'JAN'];
      break;
    case 'q3':
      labels = ['FEB', 'MAR', 'APR'];
      break;
    case 'q4':
      labels = ['MAY', 'JUN', 'JUL'];
      break;
  }

  for (let i = 0; i < labels.length; i++) {
    labels[i] = labels[i].toLowerCase(); 
    arr = this.assignZero(data, i, labels, selyear, 'forED');
    }

  return arr;

}

checkYearDataED(data, years) {
  const currentYear = new Date().getFullYear();
  const selectedYear = currentYear - years;
  const res = [];
  for (let i = (selectedYear + 1); i <= currentYear; i++) {
    const yearArr = data.filter(x => x.year === i);
    const obj = {
      label: i.toString(),
      year: i,
      licenseDownloads: 0,
      orderFullfillments: 0,
      softwareDownloads: 0,
      oba: 0
    };
    if (yearArr.length) {
      obj.licenseDownloads = yearArr.reduce((val, o) => val + o.licenseDownloads, 0);
      obj.softwareDownloads = yearArr.reduce((val, o) => val + o.softwareDownloads, 0);
      obj.orderFullfillments = yearArr.reduce((val, o) => val + o.orderFullfillments, 0);
      obj.oba = yearArr.reduce((val, o) => val + o.oba, 0);
    }
    res.push(obj);
  }

  return res;
}

transform(value: any, args?: any): any {
  let exp: any;
  const suffixes = ['K', 'M', 'B', 'T', 'P', 'E'];

  if (!value || Number.isNaN(value)) {
    return 0;
  }

  if (value < 1000) {
    return value;
  }

  exp = Math.floor(Math.log(value) / Math.log(1000));

  return (value / Math.pow(1000, exp)).toFixed(args).replace(/\.0+$/, '') + suffixes[exp - 1];
}

}
