import React, { useState, useEffect } from 'react';

//const possibleValues = ["ANGORA", "ACRYLIC", "COTTON", "CHIFFON"]

export default function MyAutocomplete(props) 
{
  const [lastValue, setLastValue] = useState('');
  const [inputValue, setInputValue] = useState(props.valueVariable);
  const [suggestions, setSuggestions] = useState([]);

  const handleKeyUp = (event) => {
    if (event.code == 'Enter')
    {
      let ev = event;
      //console.log('ddd:')
      //console.log(props.valueVariable)
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
    let value = event.target.value;
    const parts = value.split(/;|,| /) ;//split(' ');
    const last = parts.length > 0 ? parts[parts.length-1] : "";
    setLastValue(last);
    let char_prior = last.length>1 ? last[last.length-2] : null
    let char_last = last.length ? last[last.length-1] : null
    if (char_prior && char_last && parts.length > 0) {
      if (isNaN(char_prior) && !isNaN(char_last)) {
        let v = value.substring(0, value.length - last.length)
        v = v + last.substring(0, last.length-1) + ' ' + char_last
        value = v.replace(/^\s+/g, ''); // remove start spaces
      }
    }

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
      if (p!='' && p!=' ' && p!=';') {
        if (isNaN(p)) {
          input = input.length > 0 ? input + ' ' + p : p;
        } else {
          input += ' ' + p + ';';
        }
      }
     })

    let newValue = input + ' ' + value
    setInputValue(newValue);
    props.setValueFn(newValue);
    setSuggestions([]);
  };

  useEffect(() => {
    setInputValue(props.valueVariable)
    //setTimeout(function() { setInputValue(props.valueVariable); console.log('vvvvv:'); console.log(props.valueVariable); }, 2000)
    /*console.log('------------------------')
    console.log('MyAutocomplete useEffect')
    console.log('props.getValueFn():')
    console.log(props.getValueFn())
    console.log('------------------------')*/

    //setTimeout(function() { setInputValue(props.valueVariable); console.log('vv:'); console.log(props.valueVariable); },500)
    

  }, [props.valueVariable]);

  //setInputValue(props.getValueFn())
  /*console.log('------------------------')
  console.log('MyAutocomplete render')
  console.log('props.getValueFn():')
  console.log(props.getValueFn())
  console.log('------------------------')*/

  return (
    <div className="autocomplete-wrapper"  >
      <label>{props.title}</label>
      <input
        ////key="my-autocomp"
        ////id="my-autocomp"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyUp={handleKeyUp}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
        className="autocomplete-input"
        sx={{ ...props.itemStyle,  ...{  } }}
        />
      {suggestions.length > 0 && (
        <ul id="autocomplete-list" className="suggestions-list" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              role="option"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
