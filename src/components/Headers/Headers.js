import React from "react";
import "./Headers.css";
import categories from "../../data/categories";
import { createMuiTheme, TextField, ThemeProvider } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";

let isTyping = false;
let timeoutKeeper;

const Headers = ({ word, setword, dictionaryApi ,setCategory,setmeanings}) => {
  const handleChange = (e)=>{
    setCategory(e.target.value);
    setword("");
    setmeanings([]);
  }
  return (
    <div>
      <div className="heading">{word ? word : "SHABDKOSH"}</div>
      <br />
      <div className="input_area">
        <div className="word">
          <input
            placeholder="Search a Word"
            className="input_word"
            type="text"
            onChange={(e) => {
              setword(e.target.value);
              clearTimeout(timeoutKeeper);
              if (!isTyping) {
                console.clear();
                isTyping = true;
                console.log('User Typing...')
              }
              timeoutKeeper = setTimeout(() => {
                isTyping = false;
                console.log('Now Searching word...')
                dictionaryApi(e.target.value);
              }, 1500);

            }}
          />
        </div>
        <div className="countries">
          <select onChange={(e)=>handleChange(e)} label="Language" id="select">
            {categories.map(({ value, label }) => {
              return (
                <option className="options" key={label} value={value}>
                  {value}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Headers;
