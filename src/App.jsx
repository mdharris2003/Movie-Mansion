import React, { useState, useEffect } from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import { gettrendingMovies, updateSearchCount } from "./appwrite.js";
import { handleRedirect } from "./utils.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [trendingMovies, setTrendingMovies] = useState([]);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('Failed to fetch the movies');
            }

            const data = await response.json();

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch the movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }

            console.log(`Fetched ${data.results.length} movies for: ${query}`);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setErrorMessage('Error fetching movies. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTrendingMovies = async () => {
        try {
            const movies = await gettrendingMovies();
            setTrendingMovies(movies);
        } catch (error) {
            console.error("Error loading trending movies:", error);
        }
    };

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./logo.png" className="w-20 h-20"></img>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span> you'll Enjoy Without the Hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => (
                                <li key={movie.$id}>
                                    <p>{index + 1}</p>
                                <div
                                    className="relative inline-block cursor-pointer group"
                                    onClick={() => handleRedirect(movie.movie_id)}
                                >
                                <img
                                    className="w-34 h-44  transition duration-300 group-hover:blur-[1px]"
                                    src={movie.poster_url}
                                    alt={movie.title}
                                />
                                <img
                                    src="play_button.png"
                                    alt="Play"
                                    className="w-11 h-11 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                                />
                                    </div>
                                </li>


                            ))}
                        </ul>
                    </section>
                    )}

                <section className="all-movies">
                    <h2>All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </section>
            </div>
        </main>
    );
};

export default App;
