import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class App extends Component {
  componentWillMount() {

  };

  componentWillUnmount() {

  };

  render() {
    return (
      <div>
        <div>Hi there asd is a test</div>
        {this.props.children}
      </div>

    );
  }

}
