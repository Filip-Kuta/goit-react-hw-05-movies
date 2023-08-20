import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Dodaj import pliku CSS
const API_KEY = '90a674140cc367d51273d9ec4f8860ee';

function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => setTrendingMovies(data.results))
      .catch((error) => console.error('Błąd pobierania najpopularniejszych filmów:', error));
  }, []);

  return (
    <div>
      <h1 className="title">Wyszukiwanie filmów</h1>
      <h2 className="subtitle">Najpopularniejsze filmy dzisiaj:</h2>
      <ul className="movie-list">
        {trendingMovies.map((movie) => (
          <li className="movie-item" key={movie.id}>
            <Link className="movie-link" to={`/movies/${movie.id}`}>
              {movie.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
