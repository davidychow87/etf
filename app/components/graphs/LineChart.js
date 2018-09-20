//This method will use d3 to render
//pass in ref to a node
//data = array of objects { symbol: MSFT, type: series, values: [{date: "2017=01=41" ...Other data}] }
import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

export default class LineChart extends Component {
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

  createLineChart() {
    const node = this.node;
    const data = this.props.data;
    let yMax, yMin, xMax, xMin;

    // data.forEach()

    var margin = { top: 50, right: 50, bottom: 50, left: 50 }
    var width = this.props.width, height = this.props.height;
    console.log('Width is', width, 'height is', height);
    // var width = 300; var height = 300;
    var xScale = d3.scaleLinear().range([margin.left, width-margin.right]).domain([0, 10]);
    var yScale = d3.scaleLinear().range([height-margin.top, margin.bottom]).domain([0, 20]);
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);


   
    var svg = d3.select(node)
      .append('g')
      // .attr('transform', `translate(${margin.left}, ${margin.top})`)
    

    svg.append('g')
      .attr('transform', `translate(0, ${height - margin.bottom})`)
      .call(xAxis);
    
    svg.append('svg:g')
      .attr('transform', `translate(${margin.right}, 0)`)
      .call(yAxis);

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
    return (<svg 
              ref={node => this.node = node} 
              width={width} height={height}
              style={{margin: '10px'}}
            >
            </svg>);
  }

}









// class LineChart extends React.Component {

//     // render() {
//     //     let data = this.props.data;

//     //     const div = new ReactFauxDom.Element('div');

//     //     let svg = d3.select(div).append('svg')
//     //         .attr('width')
//     // }
  
//     render() {
//         console.log('Line');
//         const el = ReactFauxDom.createElement('div');
        
//         // d3.select(div).append('div').html('Hello World')
        
//         el.style.setProperty('color', 'black');
//         el.setAttribute('class', 'box');
//             console.log('EL RE', el.toReact())
//         return el.toReact();

//     }

// };

// export default LineChart;

// import React from 'react'
// import * as d3 from 'd3'
// import {withFauxDOM} from 'react-faux-dom'

// class LineChart extends React.Component {
//   componentDidMount () {
//     const faux = this.props.connectFauxDOM('div', 'chart')
//     d3.select(faux)
//       .append('div')
//       .html('Hello WorldFag!')
//     this.props.animateFauxDOM(800)
//   }

//   render () {
//     return (
//       <div>
//         <h2>Here is some fancy data:</h2>
//         <div className='renderedD3'>
//           {this.props.chart}
//         </div>
//       </div>
//     )
//   }
// }

// LineChart.defaultProps = {
//   chart: 'loading'
// }

// export default withFauxDOM(LineChart)