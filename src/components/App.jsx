import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
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

const MovieInfoContainer = styled.div``;

const MovieDescription = styled.div``;

const MovieInfoList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MovieInfoItem = styled.li``;

const ProductionCompanyList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ProductionCompanyItem = styled.li``;

const CastButton = styled.button``;

const ReviewsButton = styled.button``;

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
      <Title>Wyszukiwanie filmów</Title>
      <Subtitle>Najpopularniejsze filmy dzisiaj:</Subtitle>
      <MovieList>
        {trendingMovies.map((movie) => (
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

function MovieDetails() {
  const { movieId } = useParams();
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showCast, setShowCast] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    // Pobieranie informacji o filmie, obsadzie i recenzjach
    Promise.all([
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,production_companies`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`),
      fetch(`https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${API_KEY}`)
    ])
      .then(([movieResponse, castResponse, reviewsResponse]) =>
        Promise.all([movieResponse.json(), castResponse.json(), reviewsResponse.json()])
      )
      .then(([movieData, castData, reviewsData]) => {
        setMovieDetails(movieData);
        setCast(castData.cast);
        setReviews(reviewsData.results);
      })
      .catch((error) => console.error('Błąd pobierania informacji o filmie:', error));
  }, [movieId]);

  if (!movieDetails) {
    return <div className="loading">Ładowanie...</div>;
  }

  const { title, overview, poster_path, production_companies, genres, vote_average } = movieDetails;

  return (
    <div>
      <Title>{title}</Title>
      <img
        src={`https://image.tmdb.org/t/p/w500/${poster_path}`}
        alt={title}
      />
      <MovieInfoContainer>
        <MovieDescription>
          <p>{overview}</p>
        </MovieDescription>
        <MovieInfoList>
          <MovieInfoItem>User score: {vote_average * 10}%</MovieInfoItem>
          <MovieInfoItem>Genres: {genres.map(genre => genre.name).join(', ')}</MovieInfoItem>
          <MovieInfoItem>
            Production companies:
            <ProductionCompanyList>
              {production_companies.map((company) => (
                <ProductionCompanyItem key={company.id}>
                  {company.name}
                </ProductionCompanyItem>
              ))}
            </ProductionCompanyList>
          </MovieInfoItem>
        </MovieInfoList>
      </MovieInfoContainer>
      <CastButton onClick={() => setShowCast(!showCast)}>Zespół aktorski</CastButton>
      <ReviewsButton onClick={() => setShowReviews(!showReviews)}>Recenzje</ReviewsButton>
      {showCast && (
        <div className="cast-info">
          <h2>Obsada:</h2>
          <ul>
            {cast.map((actor) => (
              <li key={actor.id}>
                <img src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`} alt={actor.name} />
                <p>{actor.name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {showReviews && (
        <div className="reviews-info">
          <h2>Recenzje:</h2>
          <ul>
            {reviews.map((review) => (
              <li key={review.id}>
                <h3>{review.author}</h3>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


function App() {
  return (
    <Router>
      <div>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Strona główna</Link>
          </li>
          <li className="nav-item">
            <Link to="/movies" className="nav-link">Wyszukiwanie filmów</Link>
          </li>
        </ul>
        <hr />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/movies" element={<Movies />} />
          <Route path="/movies/:movieId" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
