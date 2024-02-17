import "./App.css";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

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
    // const searchInput = document.querySelector(".search");
    // console.log("clear");
    if (setSearch.length > 0) {
      console.log("clear");
      setSearch("");
      setResults([]);
      setSearchInfo({});
    }
  };

  useEffect(() => {
    if (search.length <= 0 && results.length > 0) {
      setResults([]);
      setSearchInfo({});
    } else {
      return;
    }
  }, [search]);

  return (
    <main className="App">
      <header>
        <div className="logo" aria-hidden="true">
          <span className="blue logo-letter">Q</span>
          <span className="red logo-letter">U</span>
          <span className="yellow logo-letter">E</span>
          <span className="blue logo-letter">R</span>
          <span className="green logo-letter">Y</span>
          <span className="red logo-letter">.</span>
          <span className="blue logo-letter">M</span>
          <span className="yellow logo-letter">E</span>
          <span className="red exclaim logo-letter">!</span>
        </div>
        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-inner-div">
            <i
              style={{ fontSize: "20px", color: "#7c7c7c" }}
              className="fa-sharp fa-solid fa-magnifying-glass"
            >
              {" "}
            </i>
            <input
              className="search"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
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
            <button className="random-btn">Wanna read Random Article?</button>
          </a>
        </div>
        {searchInfo.totalhits ? (
          <p>
            Total Results:
            <span className="total-results"> {searchInfo.totalhits}</span>
            <span className="text-light">(currently showing 20)</span>
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
      <footer className="flex-end">
        <p className="flex-center" style={{ color: "#7c7c7c" }}>
          Copyright
          <a
            href="https://github.com/amanr-dev"
            style={{ color: "#7c7c7c", textDecoration: "none" }}
            className="flex-center"
          >
            <span> @Aman Rawat</span>
            <FaGithub style={{ fontSize: "25px" }} />
          </a>
        </p>
      </footer>
    </main>
  );
}

export default App;
