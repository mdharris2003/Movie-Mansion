// utils.js
export const handleRedirect = (movieId) => {
    if (!movieId) {
        console.warn("Movie ID is missing");
        return;
    }
    window.location.href = `https://www.themoviedb.org/movie/${movieId}`;
};
