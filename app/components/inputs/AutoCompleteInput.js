import Autosuggest from 'react-autosuggest';
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import theme from 'css/components/autosuggest';

const list = [];

export default class AutoCompleteInput extends Component {

    state = {
        value: '',
    }

    renderSuggestion = (suggestion) => {
        return (
            <span>
            {suggestion.suggestion}
            </span>
        );
    }

    onChange = (event, { newValue }) => {
        this.props.onChange(newValue);
        this.setState({
            value: newValue.toUpperCase(),
        });
    }

    render() {
        const { getSuggestionValue, suggestions, placeholder, onSuggestionsClearRequested, onSuggestionsFetchRequested } = this.props;

        const { value } = this.state;

        const inputProps = {
            placeholder: placeholder,
            value,
            onChange: this.onChange
        }

        return (
            <div>
                <Autosuggest theme={theme}
                    suggestions={suggestions} //props of suggestions
                    onSuggestionsFetchRequested={onSuggestionsFetchRequested} //called whenever need to change suggestion, passed in value
                    onSuggestionsClearRequested={onSuggestionsClearRequested} //called to clear suggestions
                    getSuggestionValue={getSuggestionValue} //need this.props.suggestionValue
                    renderSuggestion={this.renderSuggestion}
                    inputProps={inputProps}
                />
            </div>
        );
    }
};