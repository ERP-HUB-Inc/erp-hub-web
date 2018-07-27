// import React, { Component } from "react";
// import Autosuggest from "react-autosuggest";
// import {  
//   FormGroup,
// } from "reactstrap";
// import { ListSearch } from "../ListSearch";

// const languages = [
//   {
//     name: "MYDBSH Cotton V-neck t shirt",
//     sex: "M",
//     year: 1972
//   },
//   {
//     name: "Cl",
//     sex: "M",
//     year: 1972
//   },
//   {
//     name: "Ci",
//     sex: "M",
//     year: 1972
//   },
//   {
//     name: "Cd",
//     sex: "M",
//     year: 1972
//   },
//   {
//     name: "Plm",
//     sex: "M",
//     year: 2012
//   }
// ];

// // Teach Autosuggest how to calculate suggestions for any given input value.
// const getSuggestions = value => {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;

//   return inputLength === 0 ? [] : languages.filter(lang =>
//     lang.name.toLowerCase().slice(0, inputLength) === inputValue
//   );
// };

// const getSuggestionValue = suggestion => suggestion.name;

// export class AutoComplete extends Component {
//   constructor() {
//     super();
//     this.state = {
//       value: '',
//       suggestion:'',
//       suggestions: []
//     };
//     this.onKeyPress = this.onKeyPress.bind(this);
//   }

//   // onChange = (event, { newValue }) => {
//   //   this.setState({
//   //     value: newValue
//   //   });
//   //   // alert(newValue);
//   // };

//   onKeyPress(e){
//     if (e.key === 'Enter') {
//       var el1 = this.refs.ref1;

//       this.setState({
//         value: "dd"
//       });
//     }
//   }

// // Use your imagination to render suggestions.
// // renderSuggestion = (suggestion="") => (
// //   <div>
// //     {/* {suggestion.name}
// //     {suggestion.sex} */}

// //     {/* <input ref="ref1" type="text" value={ suggestion.name }/> */}

// //     <ListSearch/> 
// //   </div>
// // );

//   onSuggestionsFetchRequested = ({ value }) => {
//     this.setState({
//       suggestions: getSuggestions(value)
//     });
//   };

//   // Autosuggest will call this function every time you need to clear suggestions.
//   onSuggestionsClearRequested = () => {
//     this.setState({
//       suggestions: []
//     });
//   };

//   render() {
//     const { value, suggestions } = this.state;
//     const { placeholder }  = this.props;
//     // Autosuggest will pass through all these props to the input.
//     const inputProps = {
//       placeholder: `${placeholder}`,
//       value,
//       // onChange: this.onChange,
//       onKeyPress: this.onKeyPress
//     };

//     // Finally, render it!
//     return (
//       <div className="main-input auto-complete-input">
//         <FormGroup>
//           <span className="fa fa-plus-circle icon-search"></span>
//           <Autosuggest
//             // multiSection={true}
//             suggestions={suggestions}
//             onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
//             onSuggestionsClearRequested={this.onSuggestionsClearRequested}
//             getSuggestionValue={getSuggestionValue}
//             renderSuggestion={this.renderSuggestion}
//             inputProps={inputProps}
//           />
//           <span className="fa fa-plus-circle icon-plus"></span>
//         </FormGroup>
//       </div>
//     );

//   }
// }
