import { Directive, OnInit, Input, ElementRef, OnChanges, SimpleChanges, HostListener, SimpleChange } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { UserInsightService } from '../services/user-insight.service';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
@Directive({
  selector: '[appAppLineChart]'
})
export class AppLineChartDirective {

  public width = 459;
  public height = 290;
  @Input() margin = { top: 50, right: 10, bottom: 50, left: 90 };
  @Input() isGradient: boolean;
  @Input() stylelingClass: string;
  @Input() chartColors: any;
  @Input() data: any;
  @Input() legends: any;
  @Input() tooltipHeading: string;

  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html(d => {
      console.log(d);
      return `<div class='chartTooltip'>
                  <div class='content'>
                  <p class="label">${this.tooltipHeading}</p>
                  <span class="value">${this.numberWithCommas(d.count)}</span>
                  </div>
                  </div>
                `;
    });

  constructor(private element: ElementRef, public titlecasePipe: TitleCasePipe, 
              public managementDashboardService : UserInsightService) { }

  ngOnInit() {
   // this.drawChart();

  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'data': {
            this.drawChart();
          }
        }
      }
    }
    console.log('ddd', this.data);
  }

  drawChart() {
    this.width = this.element.nativeElement.offsetWidth;
    let width = this.width;
    let height = 0;
    if (window.screen.availWidth === 1366) {
      this.height = 250;
      height =  this.height;
    } else {
      this.height = 290;
      height =  this.height;
    }

    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)

      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', this.stylelingClass);

    width = +svg.attr('width') - this.margin.left - this.margin.right;
    height = +svg.attr('height') - this.margin.top - this.margin.bottom - 15;

    const group = svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    svg.call(this.tip);

    /* Add X-Asix on the SVG */
    const x = d3.scaleBand().range([0, width]);
    x.domain(this.data.map(d => d.label));
    group.append('g').attr('class', 'eng-xaixs graph-txt2').attr('transform', 'translate(0,' + (height) + ')')
      .call(d3.axisBottom(x).tickFormat(d => {
        if (d.includes('fy')) {
          return d.toUpperCase();
        } else {
          const lab = this.titlecasePipe.transform(d);
          return lab;
        }
      }));

    /* Add Y-Asix on the SVG */
    const y = d3.scaleLinear().domain([0, d3.max(this.data, (d) => {
      return d.count;
    })]).range([height, 0]).nice();
    group.append('g').attr('class', 'y axis graph-txt2')
      .attr('transform', 'translate(0,0)')
      .call(d3.axisLeft(y).tickSize(-width)
        .ticks(8).tickFormat(d => {
          return this.managementDashboardService.transform(d, 1);
        }));


    /* Add Gradient Color */
    this.addGradientColor(svg, group, height, x, y);

    /* Add Line */
    this.addLine(group, this.data, this.chartColors.color, x, y);

    /* Add Cirecle */
    this.addCircle(group, this.data, this.chartColors.color, x, y);

    /* Add Text on The Circles */
    this.addText(group, this.data, this.chartColors.color, x, y);

    /*Add Legends and Y Axis Label */
    this.addLegends(group, height);

  }


  addGradientColor(svg, group, height, x, y) {
    if (this.isGradient) {
      // Add the area
      group.append('path')
        .datum(this.data)
        .attr('fill', 'url(#' + this.chartColors.gradientId + ')')
        .attr('fill-opacity', 2)
        .attr('stroke', 'none')
        .attr('d', d3.area()
          .x((d) => {
            return x(d.label) + (x.bandwidth()) / 2;
          })
          .y0(height)
          .y1((d) => {
            return y(d.count);
          })
        );

      // Fill Gradient  Color
      const lg = svg.append('defs').append('linearGradient').attr('id', this.chartColors.gradientId).attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%')
        ;

      lg.append('stop')
        .attr('offset', '0%')
        .style('stop-color', this.chartColors.gradientColor1)
        .style('stop-opacity', 1);

      lg.append('stop')
        .attr('offset', '100%')
        .style('stop-color', this.chartColors.gradientColor2)
        .style('stop-opacity', 1);

    }
  }

  addLine(svg: any, data: any, color: string, x: any, y: any) {
    svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 2)
    .attr('d', d3.line()
      .x((d) => {
        return x(d.label) + (x.bandwidth()) / 2;
      })
      .y((d) => {
        return y(d.count);
      })
    );
  }

  addCircle(svg: any, data: any, color: string, x: any, y: any) {
    const self = this;
    svg.selectAll('myCircles')
    .data(data)
    .enter()
    .append('circle')
    .attr('fill', color)
    .attr('stroke', 'white')
    .style('stroke-width', 2)
    .attr('cx', (d) => {
      return x(d.label) + (x.bandwidth()) / 2;
    })
    .attr('cy', (d) => {
      return y(d.count);
    })
    .attr('r', 5).on('mouseover', function(d) {
      self.tip.show(d, this);
    })
    .on('mouseout', function(d) { self.tip.hide(d, this); });
  }

  addText(svg: any, data: any, color: string, x: any, y: any) {
    svg.selectAll('.bartext')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'graph-txt3')
    .attr('text-anchor', 'middle')
    .attr('fill', '#333333')
    .attr('x', (d) => {
      return x(d.label) + (x.bandwidth()) / 2;
    })
    .attr('y', (d) => {
      return y(d.count) - 10;
    })
    .text((d) => {
      return this.managementDashboardService.transform(d.count, 1);
    });
  }

   addLegends(group , height) {
    // Y axis label:
    group.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y',  - 65)
      .attr('x', - height / 2)
      .attr('dy', '1em')
      .attr('class', 'graph-txt1')
      .style('text-anchor', 'middle')
      .text('Value in Counts');

    const div = d3.select(this.element.nativeElement).append('div').attr('class', 'legend-wrapper');
    const table = div.append('table');
    const legend = table.attr('class', 'legend normal-style');
    const tr = legend.append('tr');
    const td = tr.selectAll('td').data(this.legends).enter().append('td');

    td.append('svg').attr('width', '20').attr('height', '10').append('rect')
        .attr('x', 0)
        .attr('y', 3)
        .attr('rx', 1.5)
        .attr('width', '20').attr('height', '3')
        .attr('fill', (d, i) => this.legends[i].color);

    td.append('text')
        .attr('class', 'graph-txt4')
        .text(d => {
          return d.label;
        });
   }


  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawChart();
  }

}
