import { Directive, OnInit, Input, ElementRef, OnChanges, SimpleChanges, HostListener, SimpleChange, OnDestroy } from '@angular/core';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import { TitleCasePipe } from '@angular/common';
import { UserInsightService } from '../services/user-insight.service';
@Directive({
  selector: '[appGrpupBarChart]'
})
export class GrpupBarChartDirective {

  public width = 459;
  public height = 290;
  @Input() margin = { top: 50, right: 10, bottom: 50, left: 90 };
  @Input() data: any;
  @Input() legends: any;
  clickedBar = '';
  isBarActive = false;
  legendRect : any;
  activeBar = '';
  colors = [
    {
      key : 'ibOps',
      color : '#0E709E'
    },
    {
      key : 'sales',
      color : '#67C1BA'
    },
    {
      key : 'cx',
      color : '#C3CE3D'
    },
    {
      key : 'marketing',
      color : '#9F94C5'
    }];

  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html(d => {
      return `<div class='chartTooltip'>
                  <div class='content'>
                  <p class="label">${d.key}</p>
                  <span class="value">${this.mgmtDbService.transform(d.value, 1)}</span>
                  </div>
                  </div>
                `;
    });
  constructor(private element: ElementRef, public titlecasePipe: TitleCasePipe,
              public mgmtDbService: UserInsightService) { }



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
  }


  drawChart() {
    this.width = this.element.nativeElement.offsetWidth;
    let width = (this.width - 1);
    let height = 0;
    if (window.screen.availWidth === 1366) {
      this.height = 250;
      height =  this.height;
    } else {
      this.height = 290;
      height =  this.height;
    }
    const gap = 2;
    const self = this;
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll('*').remove();
    svg = d3.select(this.element.nativeElement)

      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('class', 'group-bar-chart');

    width = +svg.attr('width') - this.margin.left - this.margin.right;
    height = +svg.attr('height') - this.margin.top - this.margin.bottom;

    const g = svg.append('g').attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
    svg.call(this.tip);

    const x0 = d3.scaleBand()
      .rangeRound([0, width])
      .paddingInner(0.3).paddingOuter(0.3);

    const x1 = d3.scaleBand()
      .padding(0.01);

    const y = d3.scaleLinear()
      .rangeRound([height, 0]);

    const colors = d3.scaleOrdinal()
      .range(['#0E709E', '#67C1BA', '#C3CE3D', '#9F94C5']);

    const data = this.data;
    let keys = Object.keys(data[0]).slice(1);
    keys.splice(0, 2);

    x0.domain(data.map((d) => {
      return d.label;
    }));
    x1.domain(keys).rangeRound([0, (x0.bandwidth() - 15)]);


    y.domain([-0, d3.max(data, (d) => {
      return d3.max(keys, (key) => {
        return d[key];
      });
    })]).nice();

    /* Call X-Axis */
    g.append('g')
      .attr('class', 'eng-xaixs graph-txt2')
      .attr('transform', 'translate(-9,' + height + ')')
      .call(d3.axisBottom(x0).tickFormat(d => {
        if (d.includes('fy')) {
          return d.toUpperCase();
        } else {
          const lab = this.titlecasePipe.transform(d);
          return lab;
        }
      }));  

    /* Call Y-Axis */
    g.append('g')
      .attr('class', 'y axis graph-txt2')
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(d => {
        return this.mgmtDbService.transform(d, 1);
      }));

    /* Append Rect */

    const bars = g.append('g').selectAll('g')
      .data(data)
      .enter().append('g')
      .attr('transform', (d) => {
        return 'translate(' + x0(d.label) + ',0)';
      })
      .selectAll('rect')
      .data((d) => {
        return keys.map((key) => {
          return { key, value: d[key] };
        });
      })
      .enter().append('rect')
      .attr('width', x1.bandwidth() - gap)
      .attr('x', (d) => {
        return x1(d.key);
      })
      .attr('y', (d) => {
        return y(d.value);
      })
      .attr('height', (d) => {
        return height - y(d.value);
      }).attr('fill', (d) => {
        return colors(d.key);
      }).attr('class', 'graph-group-bar');

    bars.on('mouseover', function (d) {
      if (self.isBarActive) {
        self.tip.hide();
      } else {
        self.tip.show(self.changeKey(d), this);
      }
    }).on('mouseout', function (d) {
      self.tip.hide();
    }).on('click', (d) => {
        console.log(d)
      self.tip.hide();
      this.isBarActive = !this.isBarActive;
      if (this.isBarActive) {
        this.addLineAndCircle(d, g, bars, data, x0, x1, y, this.legendRect, this.isBarActive, svg, 'bar');
      } else {
        this.resetElement(svg);
      }
    });

    /*Add Legends and Y Axis Label */
    this.addLegends(g, height, bars, svg, data, x0, x1, y);
  }

  addLegends(group, height, bars, svg, data, x0, x1, y) {

    // Y axis label:
    group.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', - 65)
      .attr('x', - height / 2)
      .attr('dy', '1em')
      .attr('class', 'graph-txt1')
      .style('text-anchor', 'middle')
      .text('Value in Counts');

    const div = d3.select(this.element.nativeElement).append('div').attr('class', 'legend-wrapper');
    const table = div.append('table');
    const legend = table.attr('class', 'legend normal-style graph-group-bar');
    const tr = legend.append('tr');
    const td = tr.selectAll('td').data(this.legends).enter().append('td');

    this.legendRect = td.append('svg').attr('width', '20').attr('height', '10').append('rect')
      .attr('x', 10)
      .attr('y', 0)
      .attr('rx', 2.9)
      .attr('width', '10').attr('height', '10')
      .attr('fill', (d, i) => this.legends[i].color);

    td.append('text')
      .attr('class', 'graph-txt4')
      .text(d => {
        return d.label;
      });

    td.on('click', (d, i) => {
      this.isBarActive = !this.isBarActive;
      this.addLineAndCircle(d, group, bars, data, x0, x1, y, this.legendRect, this.isBarActive, svg, 'legends');
    });

    // Its Draw Line Again onResize
    const obj = {
      label: this.activeBar
    };
    if (this.isBarActive) {
      this.addLineAndCircle(obj, group, bars, data, x0, x1, y, this.legendRect, this.isBarActive, svg, 'legends');
    }
  }

  addLineAndCircle(d, group, bars, data, x0, x1, y, legendRect, isBarActive, svg,  from) {

    if (from === 'legends') {
      this.activeBar =  d.label.replace(/\s/g, '').toLowerCase();
      this.clickedBar =  this.activeBar;
    } else {
      this.activeBar =  d.key.replace(/\s/g, '').toLowerCase();
      this.clickedBar =  this.activeBar;
    }
 

    if (isBarActive) {
      const rect = bars.filter((e) => {
        return e.key.toLowerCase() !== this.activeBar;
      });


      const rect2 = legendRect.filter((e) => {
        let legends =  e.label;
        legends = legends.replace(/\s/g, '').toLowerCase();
        return legends !== this.activeBar;
      });

      rect.classed('disabled-bar', true);
      rect2.classed('disabled-bar', true);

      const rect3 = bars.filter( (e) => {
        return e.key.toLowerCase() === this.activeBar;
      });

      // tslint:disable-next-line: radix
      const width = parseInt(rect3._groups[0][0].attributes[0].nodeValue) / 2;
      // tslint:disable-next-line: radix
      const barPosition = parseInt(rect3._groups[0][0].attributes[1].nodeValue);

      if (this.clickedBar === 'ibops') { this.clickedBar = 'ibOps'; }

      const filteredData = [];
      data.map(el => {
        const colors = this.colors.filter(ele => {
          return ele.key === this.clickedBar;
        });
        filteredData.push({
          label: el.label,
          key:  this.clickedBar,
          value: el[ this.clickedBar],
          color : colors[0].color
        });
      });

      // Add Line on the Bars
      group.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('id', 'line_0')
        .attr('stroke', filteredData[0].color)
        .attr('stroke-width', 2)
        .attr('d', d3.line()
          .x((d, i) => {
            return x0(d.label) + barPosition + width;
          })
          .y((d, i) => {
            return y(d.value);
          })
        );


    // Add Circles on the Bars

      group.selectAll('myCircles')
      .data(filteredData)
      .enter()
      .append('circle')
      .attr('fill', filteredData[0].color)
      .attr('class', 'circle_0')
      .attr('stroke', 'white')
      .style('stroke-width', 2)
      .attr('cx', (d) => {
        return x0(d.label) + barPosition + width;
      })
      .attr('cy', (d) => {
        return y(d.value);
      })
      .attr('r', 5);

    // Add Text on the bars

      group.selectAll('.bartext')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('class', 'graph-txt5 text_0')
      .attr('text-anchor', 'middle')
      .attr('fill', '#333333')
      .attr('x', (d) => {
        return x0(d.label) + barPosition + width;
      })
      .attr('y', (d) => {
        return y(d.value) - 10;
      })
      .text((d) => {
        return this.mgmtDbService.transform(d.value, 1);
      });


    } else {
       this.resetElement(svg);
     }
  }


  resetElement(svg) {
    this.isBarActive = false;
    d3.selectAll('rect').classed('disabled-bar', false);
    d3.select('#line_0').remove();
    svg.selectAll('circle.circle_0').remove();
    svg.selectAll('text.text_0').remove();
  }

  changeKey(d) {
    let obj = {};
    const labels = [
      {
        key: 'ibOps',
        label: 'IB Ops'
      },
      {
        key: 'sales',
        label: 'Sales'
      },
      {
        key: 'cx',
        label: 'CX'
      },
      {
        key: 'marketing',
        label: 'Marketing'
      },
    ];

    const result = labels.filter(el => {
      console.log('fffff', el, d);
      return el.key === d.key;
    });

    obj = {
      key: result[0].label,
      value: d.value
    };
    return obj;
  }


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.drawChart();
  }
}
