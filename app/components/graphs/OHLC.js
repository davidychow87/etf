//This method will use d3 to render
//pass in ref to a node
//data = array of objects { symbol: MSFT, type: series, values: [{date: "2017=01=41" ...Other data}] }
import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import MockData from './MockData';
import moment from 'moment';
import classNames from 'classnames/bind';
import style from 'css/components/ohlc';

const cx = classNames.bind(style);

export default class OHLC extends Component {
  static propTypes = {
    // data: PropTypes.array.isRequired,
  }


  componentWillMount() {
    this.createLineChart = this.createLineChart.bind(this);
    console.log("React version", React.version);
  }

  componentDidMount() {
       
    this.createLineChart();
  }

  componentDidUpdate() {
    this.createLineChart();
  }

  plotGraph(node) {
    console.log('passed node is', node);
    let xScale = d3.scaleTime(), yScale = d3.scaleLinear();

    let isUpDay = (d) => {
      return d.close > d.open;
    }

    let isDownDay = (d) => {
      return !isUpDay(d);
    }

    let tickWidth = 5;

    let line = d3.line()
      .x((d) => {
        console.log('linex', d.x, d.y);
        return d.x;
      })
      .y((d) => {
        return d.y;
      });


      function x(d) {
        return d[0];
      }

      function y(d) {
        return d[1];
      }

    let lined = d3.line()
      .x((d) => {
        console.log('lined', xScale(d.date), yScale(d.close))
        return xScale(d.date)
      })
      .y((d) => {
        return yScale(d.close)
      })

      let circle = d3.symbol()
        .type();

    let highLowLines = (bars, data) => {
   
// //works
      // let paths = d3.select(node).append('path')
      //   .datum(data)
      //   .attr('class', 'line')
      //   .attr('d', lined)
        // .style('fill', 'none')
        // .style('stroke', 'steelblue')
        // .style('stroke-width', '2px');


        let paths = d3.select(node).selectAll('.high-low-line')
        .data(data)
        .enter().append('path').classed('high-low-line', true)
        .attr('d', (d) => {
            console.log('d is', d);
            return line([
              { x: xScale(d.date), y: yScale(d.high) },
              { x: xScale(d.date), y: yScale(d.low) }
            ])
        })
        // .style('fill', 'none')
        // .style('stroke', 'steelblue')
        // .style('stroke-width', '2px'); console.log('paths afte2r', paths);




//       let paths = d3.select(node).selectAll('.high-low-line').data(data, (d) => {
//         console.log('D is', d);
//         return d;
//       });
// console.log('paths a!re now', paths);
//       paths.enter().append('path');

//       paths.classed('high-low-line', true)
//         .attr('d', (d) => {
//           console.log('d is', d);
//           return line([
//             { x: xScale(d.date), y: yScale(d.high) },
//             { x: xScale(d.date), y: yScale(d.low)}
//           ])
//         })
    };

    let ticks = (bars) => {
      let tickWidth = 5;

      let open = bars.selectAll('.open-tick').data((d) => {
        return [d];
      }).enter().append('path').classed('open-tick', true)
        .attr('d', (d) => {
          return line([
            { x: xScale(d.date) - tickWidth, y: yScale(d.close) },
            { x: xScale(d.date), y: yScale(d.open) }
          ])
        });

      let close = bars.selectAll('.close-tick').data((d) => {
        return [d];
      }).enter().append('path').classed('close-tick')
        .attr('d', (d) => {
          return line([
            { x: xScale(d.date), y: yScale(d.close) },
            { x: xScale(d.date) + tickWidth, y: yScale(d.open) }
          ])
        });
    }

    var ohlc = function(selection) {
      var series, bars;
      var dataset = d3.range(6).map(function(d) { return {"y": d3.randomUniform(1)() } });
      console.log('dataset is', dataset);

//       var matrix = [
//         [11975,  5871, 8916, 2868],
//         [ 1951, 10048, 2060, 6171],
//         [ 8010, 16145, 8090, 8045],
//         [ 1013,   990,  940, 6907, 123],
//         [ 1013,   990,  940, 6907]
//       ];
      
//       var tr = d3.select("body")
//         .append("table")
//         .selectAll("tr")
//         .data(matrix)
//         .enter().append("tr");
//       console.log('TR', tr);
//       var td = tr.selectAll("td")
//         .data(function(d) { return d; })
//         .enter().append("td")
//           .text(function(d) { return d; });
// console.log('tf!', td);
      
      selection.each((data) => {
        console.log('data is', data);
        series = d3.select(node).selectAll('.ohlc-series').data(data);
        series.enter().append('svg:g').classed('ohlc-series', true);
          console.log('series2 is', series);
          console.log('gonna bars!s');
        bars = d3.select(node).selectAll('.bar')
          .data(data, function(d) {
            console.log('d.date is', d.date);
            return d;
          });
      
        bars.enter()
          .append(':g')
          .classed('bar', true);

        bars.classed('up-day', (d) => {
          return d.close > d.open;
        })

        bars.classed('down-day', (d) => {
          return d.close <= d.open;
        })

        // bars.classed({
        //   'up-day': (d) => {
        //     return d.close > d.open;
        //   },
        //   'down-day': (d) => {
        //     return d.close <= d.open;
        //   }
        // });
        highLowLines(bars, data);
        // ticks(bars);

        bars.exit().remove();
      });

    }

    ohlc.xScale = (value) => {
      if (!value) {
        return xScale;
      };
      xScale = value;
      return ohlc;
    }

    ohlc.yScale = (value) => {
      if (!value) {
        return yScale;
      };
      yScale = value;
      return ohlc;
    }

    ohlc.tickWidth = (value) => {
      if (!arguments.length) {
        return tickWidth;
      }
      tickWidth = value;
      return ohlc;
    }
    
    return ohlc;
  }

  createLineChart() {
    console.log('moment', moment('2014-01-12').format())
    var data = new MockData(0.2, 0.2, 10, 5, function(moment) {
      return !(moment.day() === 0 || moment.day() === 6);
  }).generateOHLC(new Date(2014, 1, 1), new Date(2014, 1, 11));

  // console.log('Datas test is!', data);

    const node = this.node;
    // const data = this.props.data;
    let yMax, yMin, xMax, xMin;

    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var width = this.props.width, height = this.props.height;

    
    let maxDate = d3.max(data, (d) => {
      return d.date;
    });

    // console.log('MaxDate is', maxDate)
    // console.log('MaxDate is time', maxDate.getTime())

    // console.log('masd', d3.max(data, (d) => {
    //   return d.high;
    // }));

    var xScale = d3.scaleTime().range([margin.left, width-margin.right]).domain([
      new Date(maxDate.getTime() - (8.64e7 * 31.5)),
      new Date(maxDate.getTime() + 8.64e7)
    ]);
    var yScale = d3.scaleLinear().range([height-margin.top, margin.bottom]).domain([
      d3.min(data, (d) => {
        return d.low;
      }),
      d3.max(data, (d) => {
        return d.high;
      })
    ]);
    console.log('data [0', data[0]);
    var xAxis = d3.axisBottom(xScale).ticks(5);
    var yAxis = d3.axisLeft(yScale);
   console.log('outer xscale', xScale(data[0].date) );
    var svg = d3.select(node)
      .append('g')
      // .attr('transform', `translate(${margin.left}, ${margin.top})`)
    

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
    
    svg.append('svg:g')
      .attr('transform', `translate(${margin.right}, 0)`)
      .call(yAxis);

    //plot the graph
    let series = this.plotGraph(node);
    console.log('series is', series);
    series.xScale(xScale).yScale(yScale);

    svg.append('g')
      .attr('class', 'series')
      .datum(data)
      .call(series)


    var bordercolor = 'black';
    var border = 1;
    var borderPath = svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", height)
      .attr("width", width)
      .style("stroke", bordercolor)
      .style("fill", "none")
      .style("stroke-width", border);
  }

  render() {

  
    // console.log('with', this.props.width, 'ehgith', this.props.height);
    const { height, width } = this.props;
    return (
    
        <div className={cx('line')}>
            <svg 
              ref={node => this.node = node} 
              width={width} height={height}
              style={{margin: '10px'}}
            >
            </svg>
        </div>
    )
    
  }

}







