import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import MovieDetails from './MovieDetails';
import Movies from './Movies';
import './App.css';
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
