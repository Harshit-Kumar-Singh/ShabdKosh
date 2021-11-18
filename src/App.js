import "./App.css";
import React, { useState } from "react";
import { useEffect } from "react";
import Headers from "./components/Headers/Headers.js";
import Content from "./components/Content/Content";
import "./components/Content/Content.css";
import axios from "axios";

let BackendLink = "";

BackendLink = "https://shabdkosh-backend.herokuapp.com";

// BackendLink = "http://localhost:5000";

console.log(`[${process.env.ISHEROKU}][${process.env.BACKENDLINK}]`);

function getBackendPath(path) {
  return BackendLink + path;
}

function App() {
  const [word, setword] = useState("");
  const [meanings, setmeanings] = useState(false);
  const [category, setCategory] = useState("en");
  const [check, setCheck] = useState(true);
  async function getDataFromDb(givenWord) {
    try {
      let res = await fetch(getBackendPath("/data"), {
        method: "POST",
        body: givenWord,
      });

      res = await res.json();
      if (res.data == "WA") {
        await setCheck(false);
        console.log("WA");
      } else {
        console.log("My Database..");
        setmeanings(res.data);
        setCheck(true);
      }
    } catch (e) {
      console.log(e);
    }
  }
  const dictionaryApi = async (searchWord) => {
    await getDataFromDb(searchWord);
    console.log([check]);
    if (check == false) {
      try {
        console.log("Fetching Api External API...");

        const data = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/${category}/${
            searchWord ? searchWord : "victory"
          }`
        );
        console.log(data.data);
        let response = await fetch(getBackendPath("/"), {
          method: "POST",
          body: JSON.stringify(data.data),
        });
        response = await response.json();
        setmeanings(data.data);
      } catch (e) {
        console.log("something went wrong");
        console.log(e);
      }
    }
  };

  return (
    <div className="container">
      <Headers
        word={word}
        setword={setword}
        setCategory={setCategory}
        setmeanings={setmeanings}
        dictionaryApi={dictionaryApi}
      />
      {/* <Content innerTEXT={meanings}/> */}

      <div className="defination">
        {meanings[0] && word && category === "en" && (
          <audio
            style={{ borderRadius: "0px", marginBottom: 20 }}
            src={meanings[0].phonetics[0] && meanings[0].phonetics[0].audio}
            controls
          >
            Your browser does not support the audio element.
          </audio>
        )}

        {meanings &&
          meanings.map((mean) => {
            return mean.meanings.map((item) => {
              return item.definitions.map((def) => {
                return (
                  <div className="section">
                    {def.definition && (
                      <p
                        className="codef"
                        style={{ color: "black", fontWeight: "bold" }}
                      >
                        {def.definition}
                      </p>
                    )}
                    <em>
                      <b>Example</b>
                    </em>{" "}
                    : {def.example && <span>{def.example}</span>}
                    <br />
                    {def.synonyms && (
                      <span>
                        <em>
                          <b>Synonyms :</b>
                        </em>{" "}
                        {def.synonyms.map((s) => `${s}, `)}
                      </span>
                    )}
                  </div>
                );
              });
            });
          })}
      </div>
      <footer className="footer">
        <br />

        <hr />
        <p className="sub-footer">
          Made By : Harshit Kumar Singh And Nikhil Singh
        </p>
      </footer>
    </div>
  );
}

export default App;
