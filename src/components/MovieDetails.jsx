import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './MovieDetails.css'; // Import pliku CSS

const API_KEY = '90a674140cc367d51273d9ec4f8860ee';

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
      fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`),
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

  const { title, overview, poster_path, genres, vote_average } = movieDetails;

  const toggleCast = () => {
    setShowCast(!showCast);
    setShowReviews(false); // Zamknij recenzje
  };

  const toggleReviews = () => {
    setShowReviews(!showReviews);
    setShowCast(false); // Zamknij zespół aktorski
  };

  return (
    <div>
      <div className="movie-details-container">
        <div className="movie-poster">
          <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} alt={title} />
        </div>
        <div className="movie-info">
          <h1 className="title">{title}</h1>
          <div className="movie-description">
            <p>{overview}</p>
          </div>
          <ul className="movie-info-list">
            <li className="movie-info-item">User score: {vote_average * 10}%</li>
            <li className="movie-info-item">Genres: {genres.map(genre => genre.name).join(', ')}</li>
          </ul>
          <div className="buttons-container">
          <button onClick={toggleCast}>Zespół aktorski</button>
          <button onClick={toggleReviews}>Recenzje</button>
          </div>
          {showCast && (
            <div>
              <h2>Obsada:</h2>
              <ul className="cast-list">
                {cast.map((actor) => (
                  <li className="cast-list-item" key={actor.id}>
                    <img src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`} alt={actor.name} />
                    {actor.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {showReviews && (
            <div>
              <h2>Recenzje:</h2>
              <ul className="reviews-list">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <li className="reviews-list-item" key={review.id}>
                      <h3>{review.author}</h3>
                      <p>{review.content}</p>
                    </li>
                  ))
                ) : (
                  <li className="reviews-list-item">
                    <p>Brak recenzji dla tego filmu.</p>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
