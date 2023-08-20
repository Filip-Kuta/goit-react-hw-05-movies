import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const API_KEY = '90a674140cc367d51273d9ec4f8860ee';

// Styled Components
const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.h2`
  font-size: 18px;
  font-weight: bold;
`;

const MovieList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MovieItem = styled.li`
  margin: 10px 0;
`;

const MovieLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
`;

function Movies() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = () => {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchQuery}`)
      .then((response) => response.json())
      .then((data) => setSearchResults(data.results))
      .catch((error) => console.error('Błąd wyszukiwania filmów:', error));
  };

  return (
    <div>
      <Title>Wyszukiwanie filmów</Title>
      <div className="search-box">
        <input
          type="text"
          placeholder="Wyszukaj film..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Szukaj</button>
      </div>
      <Subtitle>Wyniki wyszukiwania:</Subtitle>
      <MovieList>
        {searchResults.map((movie) => (
          <MovieItem key={movie.id}>
            <MovieLink to={`/movies/${movie.id}`}>
              {movie.title}
            </MovieLink>
          </MovieItem>
        ))}
      </MovieList>
    </div>
  );
}

export default Movies;
