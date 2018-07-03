import React, { Component } from "react";
import Autosuggest from "react-autosuggest";
import { ListSearch } from "../ListSearch";

const languages = [
  {
    name: "Ch",
    sex: "M",
    year: 1972
  },
  {
    name: "Cl",
    sex: "M",
    year: 1972
  },
  {
    name: "Ci",
    sex: "M",
    year: 1972
  },
  {
    name: "Cd",
    sex: "M",
    year: 1972
  },
  {
    name: "Plm",
    sex: "M",
    year: 2012
  }
];

// Teach Autosuggest how to calculate suggestions for any given input value.
const getSuggestions = value => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : languages.filter(lang =>
    lang.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion.name;

export class AutoComplete extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

// Use your imagination to render suggestions.
renderSuggestion = (suggestion="") => (
  <div>
    {/* {suggestion.name}
    {suggestion.sex} */}
    <ListSearch/>
  </div>
);

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const { placeholder }  = this.props;
    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: `${placeholder}`,
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <div className="main-input auto-complete-input">
        <span className="fa fa-plus-circle icon-search"></span>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        <span className="fa fa-plus-circle icon-plus"></span>
      </div>
    );

  }
}
