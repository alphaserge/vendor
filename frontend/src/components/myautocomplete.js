import React, { useState } from 'react';

//const possibleValues = ["ANGORA", "ACRYLIC", "COTTON", "CHIFFON"]

export default function MyAutocomplete(props) 
{
  const [lastValue, setLastValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleKeyUp = (event) => {
    if (event.code == 'Enter')
    {
      let ev = event;
      const filteredSuggestions = props.data.filter(suggestion =>
        suggestion.toLowerCase().includes(lastValue.toLowerCase())
      );

      var parts = inputValue.split(/;|,| /); //.split(' ');
      var input = "";
      parts.pop();
      parts.forEach((p) => { 
        if (p!='' && p!=' ' && p!=';') {
          if (isNaN(p)) {
            input = input.length > 0 ? input + ' ' + p : p;
          } else {
            input += ' ' + p + ';';
          }
        }
       })

      if (filteredSuggestions.length>0) {
        let newValue = input + ' ' + filteredSuggestions[0]
        setInputValue(newValue);
        props.setValueFn(newValue);
        setSuggestions([]);
      }
    }
  }

  const handleInputChange = (event) => {
    const value = event.target.value;
    const parts = value.split(/;|,| /) ;//split(' ');
    const last = parts.length > 0 ? parts[parts.length-1] : "";
    setLastValue(last);
    setInputValue(value);
    props.setValueFn(value);
    if (last.length > 0) {
      const filteredSuggestions = props.data.filter(suggestion =>
        suggestion.toLowerCase().includes(last.toLowerCase())
      );
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : ['No matches found']);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (value) => {
    let parts = inputValue.split(/;|,| /); //.split(' ');
    let input = "";
    parts.pop();
    parts.forEach((p) => { 
      if (isNaN(p)) {
        input += p + ' ';
      } else {
        input += p + '; ';
      }
     })

    let newValue = input + ' ' + value
    setInputValue(newValue);
    props.setValueFn(newValue);
    setSuggestions([]);
  };

  return (
    <div className="autocomplete-wrapper">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        className="autocomplete-input"
        // Additional props
      />
      {suggestions.length > 0 && (
        <ul id="autocomplete-list" className="suggestions-list" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
              // Additional props
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
