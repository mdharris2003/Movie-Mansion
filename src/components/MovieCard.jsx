import React from 'react';
import { handleRedirect } from '../utils';

const MovieCard = ({ movie }) => {
    const {
        id,
        title,
        vote_average,
        poster_path,
        release_date,
        original_language
    } = movie;

    return (
        <div className="movie-card group overflow-hidden rounded-lg relative cursor-pointer">
            <div className="relative">
                <img
                    src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : 'no-movie.png'}
                    alt={title}
                    className="w-full h-auto transition duration-300 group-hover:blur-[2px]"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 " onClick={() => handleRedirect(id)}>
                        <img
                            src="/play_button.png"
                            alt="Play"
                            className="w-20 h-20 cursor-pointer"
                        />
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-white font-semibold">{title}</h3>
                <div className="content flex items-center gap-2 text-sm text-gray-300">
                    <div className="rating flex items-center gap-1">
                        <img src="star.svg" alt="star icon" className="w-4 h-4" />
                        <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                    </div>
                    <span>•</span>
                    <p className="lang uppercase">{original_language}</p>
                    <span>•</span>
                    <p className="year">{release_date ? release_date.split('-')[0] : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
