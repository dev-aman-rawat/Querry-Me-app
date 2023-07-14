import "./App.css";
import { useState } from "react";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search === "") return;

    const endPoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${search}`;

    const response = await fetch(endPoint);
    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw Error(response.statusText);
    }

    setResults(data.query.search);
    setSearchInfo(data.query.searchinfo);
  };

  const clearSearchResults = () => {
    const searchInput = document.querySelector(".search");
    // console.log("clear");
    if (searchInput.value.length > 0) {
      console.log("clear");
      setSearch("");
      setResults([]);
      setSearchInfo({});
    }
  };

  return (
    <main className="App">
      <header>
        <div className="logo" aria-hidden="true">
          <span className="blue">Q</span>
          <span className="red">U</span>
          <span className="yellow">E</span>
          <span className="blue">R</span>
          <span className="green">Y</span>
          <span className="red">.</span>
          <span className="blue">M</span>
          <span className="yellow">E</span>
          <span className="red exclaim">!</span>
        </div>
        <form className="search-box" onSubmit={handleSubmit}>
          <input
            className="search"
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div
            id="clear"
            className={(search.length > 0 ? "" : "none") + " " + "clear-btn"}
            role="button"
            tabIndex="0"
            aria-label="Clear search terms"
            onClick={clearSearchResults}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </form>
        <div className="random-article">
          <a
            href="https://en.wikipedia.org/wiki/Special:Random"
            target="_blank"
            rel="noreferrer"
          >
            <button className="random-btn">
              <i className="fa-sharp fa-solid fa-magnifying-glass"> </i>Random
              Article ?
            </button>
          </a>
        </div>
        {searchInfo.totalhits ? (
          <p>
            Total Results:
            <span className="total-results"> {searchInfo.totalhits}</span>
          </p>
        ) : (
          ""
        )}
      </header>
      <div className="results">
        {results.map((item, id) => {
          const url = `https://en.wikipedia.org/?curid=${item.pageid}`;
          return (
            <div key={id} className="result">
              <a href={url} target="_blank" rel="noreferrer">
                <h3>{item.title}</h3>
              </a>
              <p dangerouslySetInnerHTML={{ __html: item.snippet }}></p>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default App;
