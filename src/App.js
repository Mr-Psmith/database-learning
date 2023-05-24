import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); /* null as we dont have any errors yet */

  async function fetchMoviesHandler() {
      setIsLoading(true)
      setError(null); /* to make sure we have cleared any precvious errors */
      try {
        const response = await fetch("https://swapi.dev/api/films/"); /* if we would still use the .then method, then we would use catch() simply at the end of the line */
      const data = await response.json(); 
      /* So the values of the data we are getting are different than max is expecting, so we could either correct the values we are expecting, or we could - like below -transform the incoming data to the format we are expecting */
      const transformedMovies = data.results.map(whateverWeWantToCallIt =>{
        return {
          id: whateverWeWantToCallIt.episode_id,
          title: whateverWeWantToCallIt.title,
          openingText: whateverWeWantToCallIt.opening_crawl,
          releaseDate: whateverWeWantToCallIt.release_date
        };
      });
      setMovies(transformedMovies); /* so we save the resulting data in a state-it was before transformation "setMovies(data.results);" */
      setIsLoading(false);
      } catch {

      }
  }


  /* function fetchMoviesHandler() {
    fetch("https://swapi.dev/api/films/").then(response => {
      return response.json();
    }).then(data => {
      /* So the values of the data we are getting are different than max is expecting, so we could either correct the values we are expecting, or we could - like below -transform the incoming data to the format we are expecting
      const transformedMovies = data.results.map(whateverWeWantToCallIt =>{
        return {
          id: whateverWeWantToCallIt.episode_id,
          title: whateverWeWantToCallIt.title,
          openingText: whateverWeWantToCallIt.opening_crawl,
          releaseDate: whateverWeWantToCallIt.release_date
        }
      } )
      setMovies(transformedMovies); /* so we save the resulting data in a state-it was before transformation "setMovies(data.results);"
    });
  } */

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler} >Fetch Movies</button>
      </section>
      <section>
        { isLoading && <p>Loading...</p>}
        { !isLoading && < MoviesList movies={movies} />}
        { !isLoading && movies.length === 0 && <p>Found no movies...</p> }
      </section>
    </React.Fragment>
  );
}

export default App;