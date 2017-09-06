import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';

const list = [];

const getSuggestionValue = suggestion => suggestion[this.props.suggestionValue];

const renderSuggestion = suggestion => (
    <div>
        {suggestion[this.props.suggestionValue]}
    </div>
);

export default class AutoCompleteInput extends Component {

    state = {
        value: '',
    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue,
        });
    }

    render() {
        const { suggestions, placeHolder, onSuggestionsClearRequested, onSuggestionsFetchRequested } = this.props;

        const { value } = this.state;

        const inputProps = {
            placeHolder: placeHolder,
            value,
            onChange: this.onChange
        }

        return (
            <div>
                <Autosuggest
                    suggestions={suggestions} //props of suggestions
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested} //called whenever need to change suggestion, passed in value
                    onSuggestionsClearRequested={onSuggestionsClearRequested} //called to clear suggestions
                    getSuggestionValue={getSuggestionValue} //need this.props.suggestionValue
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
};