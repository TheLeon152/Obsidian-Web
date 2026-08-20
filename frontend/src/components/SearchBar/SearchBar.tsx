import {
  useEffect,
  useState,
} from "react";

import {
  searchNotes,
  type SearchResult,
} from "../../api/search";

import "./SearchBar.css";


interface SearchBarProps {
  onNoteClick: (
    path: string
  ) => void;
}


export function SearchBar({
  onNoteClick,
}: SearchBarProps) {

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState<SearchResult[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {

    const trimmedQuery =
      query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setError(null);
      return;
    }


    const timeout =
      setTimeout(
        async () => {

          try {

            setLoading(true);
            setError(null);

            const response =
              await searchNotes(
                trimmedQuery
              );

            setResults(
              response.results
            );

          } catch (error) {

            setError(
              error instanceof Error
                ? error.message
                : "Search failed."
            );

            setResults([]);

          } finally {

            setLoading(false);
          }

        },
        300
      );


    return () => {
      clearTimeout(timeout);
    };

  }, [query]);


  function handleResultClick(
    result: SearchResult
  ) {

    onNoteClick(
      result.path
    );

    setQuery("");
    setResults([]);
  }


  return (
    <div className="search-bar">

      <input
        type="search"
        value={query}
        onChange={(event) =>
          setQuery(
            event.target.value
          )
        }
        placeholder="Search notes..."
        className="search-input"
      />


      {query.trim() && (
        <div className="search-results">

          {loading && (
            <div className="search-state">
              Searching...
            </div>
          )}


          {!loading &&
            error && (
              <div className="search-state search-error">
                {error}
              </div>
            )}


          {!loading &&
            !error &&
            results.length === 0 && (
              <div className="search-state">
                No notes found.
              </div>
            )}


          {!loading &&
            !error &&
            results.length > 0 && (
              <ul className="search-result-list">

                {results.map(
                  (result) => (
                    <li
                      key={result.path}
                      className="search-result"
                    >

                      <button
                        type="button"
                        onClick={() =>
                          handleResultClick(
                            result
                          )
                        }
                        className="search-result-button"
                      >

                        <span className="search-result-name">
                          {result.name}
                        </span>

                        <span className="search-result-path">
                          {result.path}
                        </span>

                      </button>

                    </li>
                  )
                )}

              </ul>
            )}

        </div>
      )}

    </div>
  );
}