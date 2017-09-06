import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { testCall } from '../actions/testAction';
import { getTimeSeriesData } from '../actions/timeseries/timeSeriesAction';
import { fetchSuggestions } from '../actions/timeseries/stockSuggestionsActions';
import { connect } from 'react-redux';
import AutoCompleteInput from '../components/inputs/AutoCompleteInput';

class Main extends Component {
  handleClick() {
      // this.props.getTimeSeriesData('MSFT', 'series');
      this.props.fetchSuggestions('MS');
  };

  onSuggestionsFetchRequested = ({ value }) => {
      this.props.fetchSuggestions(value);
  }

  onSuggestionsClearRequested = () => {
      this.props.clearSuggestions();
  }

  render() {
    console.log('stock suggestions!!', this.props.suggestions);
    return (
      <Row>
        <Col xs={1}>
          {/* <AutoCompleteInput 
            suggestions={this.props.suggestions}
            placeHolder="e.g. MSFT"
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            suggestionValue="stock"
          /> */}

          <Button bsStyle="primary" onClick={() => this.handleClick()} bsSize="xs" block>
            Click Here
          </Button>
        </Col>
      </Row>

    )
  };
}

function mapStateToProps(state) {
  return {
    suggestions: state.stockSuggestions.suggestions,
  };
}

export default connect(mapStateToProps, {testCall, getTimeSeriesData, fetchSuggestions })(Main);
