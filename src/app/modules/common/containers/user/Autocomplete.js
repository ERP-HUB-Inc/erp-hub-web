import Autosuggest from "react-autosuggest";
import React from "react";
import Component from "../../components/Component";

const languages = [
  {
    name: "Cocacola",
    sex: "M",
    year: 1972
  },
  {
    name: "Fanta",
    sex: "M",
    year: 1972
  },
  {
    name: "C",
    sex: "M",
    year: 1972
  },
  {
    name: "d",
    sex: "M",
    year: 1972
  },
  {
    name: "Plm",
    sex: "M",
    year: 2012
  },
  {
    name: "C",
    sex: "M",
    year: 1972
  },
  {
    name: "test",
    sex: "M",
    year: 1972
  },
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



class Autocompletes extends Component {
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
    <this.ListSearch/>
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

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Type",
      value,
      onChange: this.onChange
    };

    // Finally, render it!
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}

export default Autocompletes;