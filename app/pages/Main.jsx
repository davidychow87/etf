import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { testCall } from '../actions/testAction';
import { getTimeSeriesData } from '../actions/timeSeriesAction';
import { connect } from 'react-redux';

class Main extends Component {
  handleClick() {
      // this.props.testCall('TestTry');
      this.props.getTimeSeriesData('MSFT');
  };

  render() {
    return (
      <Row>
        <Col xs={1}>
          <Button bsStyle="primary" onClick={() => this.handleClick()} bsSize="xs" block>
            Click Here
          </Button>
        </Col>
      </Row>

    )
  };
}

function mapStateToProps({test}) {
  return {
    test
  };
}

export default connect(mapStateToProps, {testCall, getTimeSeriesData })(Main);
