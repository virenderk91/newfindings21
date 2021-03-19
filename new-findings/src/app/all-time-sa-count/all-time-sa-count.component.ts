import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-time-sa-count',
  templateUrl: './all-time-sa-count.component.html',
  styleUrls: ['./all-time-sa-count.component.scss']
})
export class AllTimeSaCountComponent implements OnInit {

 data = [
  {
      "year": 2020,
      "count": 8326,
      "licenseDownloads": 0,
      "orderFullfillments": 0,
      "softwareDownloads": 0,
      "oba": 0,
      "label": "q1fy20"
  },
  {
      "year": 2020,
      "count": 2413,
      "licenseDownloads": 0,
      "orderFullfillments": 0,
      "softwareDownloads": 0,
      "oba": 0,
      "label": "q2fy20"
  },
  {
      "year": 2020,
      "count": 875,
      "licenseDownloads": 0,
      "orderFullfillments": 0,
      "softwareDownloads": 0,
      "oba": 0,
      "label": "q3fy20"
  },
  {
      "year": 2020,
      "count": 1691,
      "licenseDownloads": 0,
      "orderFullfillments": 0,
      "softwareDownloads": 0,
      "oba": 0,
      "label": "q4fy20"
  }
]
legends = [
  {
    color: '#67C1BA',
    label : 'SA Growth based on New Smart Account Created'
  },
];

colors = {
  color: '#67C1BA',
  gradientColor1 : 'rgba(103, 193, 186, 0.39)',
  gradientColor2 : 'rgba(103, 193, 186, 0)',
  gradientId: 'saCountChart'
};
tooltipHeading = 'No. of SA Counts';
  constructor() { }

  ngOnInit(): void {
  }

}
