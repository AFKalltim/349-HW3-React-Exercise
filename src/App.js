import { useState, useEffect } from 'react';
import './App.css';

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

function App() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentMode, setCurrentMode] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchMovies(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMovies = (page) => {
    setCurrentMode("popular");
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setMovies(data.results);
        setCurrentPage(data.page);
        if (totalPages === 1) {
          setTotalPages(data.total_pages);
        }
      })
      .catch(error => console.error("Error", error));
  };

  const searchMovies = (query, page = 1) => {
    setCurrentMode("search");
    setSearchQuery(query);
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setMovies(data.results);
        setCurrentPage(data.page);
        setTotalPages(data.total_pages);
      });
  };

  const handleSearch = (query) => {
    if (query.length > 0) {
      searchMovies(query);
    } else {
      setTotalPages(1);
      fetchMovies(1);
    }
  };

  const handleSort = (sortOption) => {
    if (sortOption === "") {
      fetchMovies(currentPage);
      return;
    }

    let sortedMovies = [...movies];
    
    if (sortOption === "release_asc") {
      sortedMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    } else if (sortOption === "release_desc") {
      sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (sortOption === "rating_asc") {
      sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
    } else if (sortOption === "rating_desc") {
      sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
    }
    
    setMovies(sortedMovies);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      if (currentMode === "search") {
        searchMovies(searchQuery, currentPage + 1);
      } else {
        fetchMovies(currentPage + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      if (currentMode === "search") {
        searchMovies(searchQuery, currentPage - 1);
      } else {
        fetchMovies(currentPage - 1);
      }
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Movie Explorer</h1>
      </header>

      <div className="searchAndSort">
        <input 
          type="text" 
          placeholder="Search for a movie..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select onChange={(e) => handleSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="release_asc">Release Date (Asc)</option>
          <option value="release_desc">Release Date (Desc)</option>
          <option value="rating_asc">Rating (Asc)</option>
          <option value="rating_desc">Rating (Desc)</option>
        </select>
      </div>

      <div className="movieGrid">
        {movies.map(movie => (
          <div key={movie.id} className="movieCard">
            <img 
              src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} 
              alt={movie.title}
            />
            <h2>{movie.title}</h2>
            <p>Release Date: {movie.release_date}</p>
            <p>Rating: {movie.vote_average}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrev} disabled={currentPage === 1}>
          Previous
        </button>
        <p id="pageNumber">Page {currentPage} of {totalPages}</p>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;