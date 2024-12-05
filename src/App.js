import "./App.css";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { MagnifyingGlass } from "react-loader-spinner";

function App() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [searchInfo, setSearchInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search === "") return;

    setLoading(true);
    setError("");

    const endPoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=25&srsearch=${search}`;

    try {
      const response = await fetch(endPoint);
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      setResults(data.query.search);
      setSearchInfo(data.query.searchinfo);
    } catch (err) {
      setError("An error occurred while fetching results. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch full article content
  const fetchFullArticle = async (pageId) => {
    setLoading(true);
    setError("");

    const articleEndpoint = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&format=json&origin=*&pageids=${pageId}`;

    try {
      const response = await fetch(articleEndpoint);
      const data = await response.json();

      if (!response.ok || !data.query.pages[pageId]) {
        throw new Error("Failed to fetch article content");
      }

      setSelectedArticle(data.query.pages[pageId]);
    } catch (err) {
      setError("An error occurred while fetching the article content.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearchResults = () => {
    setSearch("");
    setResults([]);
    setSearchInfo({});
    setSelectedArticle(null);
  };

  useEffect(() => {
    if (search.length <= 0 && results.length > 0) {
      setResults([]);
      setSearchInfo({});
    }
  }, [search, results.length]);

  return (
    <main className="App">
      <header className="w-full flex items-center flex-col justify-center">
        <div className="logo" aria-hidden="true">
          <span className="blue logo-letter">Q</span>
          <span className="red logo-letter">U</span>
          <span className="yellow logo-letter">E</span>
          <span className="blue logo-letter">R</span>
          <span className="green logo-letter">Y</span>
          <span className="red logo-letter">-</span>
          <span className="blue logo-letter">M</span>
          <span className="yellow logo-letter">E</span>
          <span className="red exclaim logo-letter">!</span>
        </div>
        <form className="search-box" onSubmit={handleSubmit}>
          <div className="search-inner-div w-full">
            <i className="fa-sharp fa-solid fa-magnifying-glass text-slate-600 text-2xl"></i>
            <input
              className="search text-slate-800 "
              type="text"
              placeholder="What would you like to know today?"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div
            id="clear"
            className={`${search.length > 0 ? "" : "none"} clear-btn`}
            role="button"
            tabIndex="0"
            aria-label="Clear search terms"
            onClick={clearSearchResults}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </form>
        <div className="random-article">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-700 to-red-500 font-semibold rounded-lg shadow-md transition duration-300 hover:shadow-lg">
            <a
              href="https://en.wikipedia.org/wiki/Special:Random"
              target="_blank"
              rel="noreferrer"
            >
              Wanna read Random Article?
            </a>
          </button>
        </div>

        {searchInfo.totalhits ? (
          <div className="w-full flex items-center justify-start text-start  p-4 max-lg:mx-auto">
            <p className=" text-slate-900 text-xl">
              Total Results:
              <span className=" text-slate-600 font-thin font-mono">
                {" "}
                {searchInfo.totalhits}
              </span>{" "}
              <span className="text-blue-500">(currently showing 25)</span>
            </p>
          </div>
        ) : (
          ""
        )}
      </header>
      {loading && (
        <div className="mt-8 p-10 flex flex-col items-center justify-center h-[50vh]">
          <div className="text-center">
            <MagnifyingGlass color="#3b82f6" />
            <span className="text-2xl text-blue-500 font-sans">Finding...</span>
          </div>
        </div>
      )}
      {error && <p className="error text-red-800">{error}</p>}
      <div className="results z-10">
        {results.map((item, id) => (
          <div
            key={id}
            className="result px-5 py-4 bg-sky-50 rounded-lg shadow-lg my-6"
            onClick={() => fetchFullArticle(item.pageid)}
          >
            <h3 className="text-xl text-slate-900">{item.title}</h3>
            <p
              className="text-base text-slate-800"
              dangerouslySetInnerHTML={{ __html: item.snippet }}
            />
          </div>
        ))}
      </div>
      {selectedArticle && (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-900/80  bg-opacity-20 z-50">
          <div className="bg-gray-100 rounded-lg shadow-lg w-full max-w-3xl  relative overflow-y-scroll max-h-[44rem] p-8">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute text-xl top-4 right-4 text-slate-900 hover:rotate-180 transition-all duration-300 hover:scale-150"
            >
              ✕
            </button>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {selectedArticle.title}
            </h2>
            <p className="text-slate-600 text-xl leading-relaxed">
              {selectedArticle.extract}
            </p>
            <div className="mt-6 text-right">
              <a
                href={`https://en.wikipedia.org/?curid=${selectedArticle.pageid}`}
                className="px-6 py-4 bg-blue-600 text-blue-100 font-medium text-xl rounded hover:bg-blue-300 transition duration-200 flex items-center justify-center"
                target="_blank"
                rel="noreferrer"
              >
                know more
                <span className="text-xl ml-2">
                  <i class="fa-solid fa-location-arrow"></i>
                </span>
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full p-6 mt-6 flex items-center justify-center flex-row">
        <a
          href="https://github.com/dipanshurdev"
          target="_blank"
          className="text-blue-500 font-serif "
          rel="noreferrer"
        >
          <span className="w-full text-xl flex gap-2">
            {" "}
            @Dipanshu Rawat <FaGithub fontSize={28} />
          </span>
        </a>
      </footer>
    </main>
  );
}

export default App;
