
import React from 'react';
import * as d3 from 'd3';
import ReactFauxDOM from 'react-faux-dom';

class SomeChart extends React.Component {
    render () {
      // Create your element.
      var el = ReactFauxDOM.createElement('div')
  
      // Change stuff using actual DOM functions.
      // Even perform CSS selections!
      el.style.setProperty('color', 'red')
      el.setAttribute('class', 'box')
  
      // Render it to React elements.
      return el.toReact()
    }
  }