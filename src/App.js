import React, { useState, useCallback, useEffect } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/add-movie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); /* null as we dont have any errors yet */

  const fetchMoviesHandler = useCallback( async () => { /* or async function () {... */
      setIsLoading(true)
      setError(null); /* to make sure we have cleared any precvious errors */
      try {
        const response = await fetch("https://database-firebasedemo-default-rtdb.firebaseio.com/movies.json");
        /* const response = await fetch("https://swapi.dev/api/films/"); */ /* if we would still use the .then method, then we would use catch() simply at the end of the line */
        if (!response.ok) { /* we should put this here,for this to be the first thing to test, as the response for the below data cosnt didnt arrive before, and it was that threw the error not our. And some APIs threw error messages, some dont */
          throw new Error("Error message of our choice");
        }
      
        const data = await response.json(); 
       
        const loadedMovies = [];

        for (const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate,

          });
        }
        /* So the values of the data we are getting are different than max is expecting, so we could either correct the values we are expecting, or we could - like below -transform the incoming data to the format we are expecting */
        /* const transformedMovies = data.results.map(whateverWeWantToCallIt =>{
          return {
            id: whateverWeWantToCallIt.episode_id,
            title: whateverWeWantToCallIt.title,
            openingText: whateverWeWantToCallIt.opening_crawl,
            releaseDate: whateverWeWantToCallIt.release_date
          };
        }); */
        //setMovies(transformedMovies); /* so we save the resulting data in a state-it was before transformation "setMovies(data.results);" and before .................. */
        setMovies(loadedMovies); 
      } catch (error) {
        setError(error.message);
      }
      setIsLoading(false);
  }, []); /* no external dependencies */

   /* with useEfect we solv the problem of the stuff only fetching on demand, so when the user cliks the button, antd not when the site is loading */
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]); /* only want to call it once otherwise it would cause an infinite loop, an if we dont give any dependencies that changes, than if they wont change, it wont run again.*/
                /* if we would give fetchMoviesHandler as we should for useEffect, than it would cerate an inf loop, as its an obj, and it uis technically changing at every rerender */

  async function addMovieHandler(movie) {
    const response = await fetch("https://database-firebasedemo-default-rtdb.firebaseio.com/movies.json", {
      method: "Post", /* By default this is GET, but here we can set this to post to send a post request, and if we */
      body: JSON.stringify(movie), /* body wants json data. stringify turns js obj or array into json format dunno that the JSON objet which is a buildt in obj what the fuck it dous, max did not thought to collaborate there  */
      headers: {
        "Content-Type": "application/json" /* for some reason we should put his obj here, nd set it to this value.  */
      }
    });
    const data = await response.json();
    console.log("data");  
  }

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = < MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>
  }
  if (isLoading) {
    content = <p>Loading...</p>
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler} >Fetch Movies</button>
      </section>
      <section>
        {content}
        {/* { isLoading && <p>Loading...</p>}
        { !isLoading && < MoviesList movies={movies} />}
        { !isLoading && movies.length === 0 && !error && <p>Found no movies...</p> }
        { !isLoading && error && <p>{error}</p> } */}
      </section>
    </React.Fragment>
  );
}

export default App;