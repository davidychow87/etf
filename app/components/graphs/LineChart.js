// import React, { Component } from 'react';
// import d3 from 'd3';
// import ReactFauxDom from 'react-faux-dom';

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

import React from 'react'
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'

class LineChart extends React.Component {
  componentDidMount () {
    const faux = this.props.connectFauxDOM('div', 'chart')
    d3.select(faux)
      .append('div')
      .html('Hello WorldFag!')
    this.props.animateFauxDOM(800)
  }

  render () {
    return (
      <div>
        <h2>Here is some fancy data:</h2>
        <div className='renderedD3'>
          {this.props.chart}
        </div>
      </div>
    )
  }
}

LineChart.defaultProps = {
  chart: 'loading'
}

export default withFauxDOM(LineChart)