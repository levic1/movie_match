import { NextResponse } from 'next/server';

const TMDB_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Mapping moods to TMDB Genre IDs
// See genres list: https://api.themoviedb.org/3/genre/movie/list?api_key=YOUR_KEY
const MOOD_GENRES: Record<string, string> = {
    'cheerful': '35,10751', // Comedy, Family
    'reflective': '18,99', // Drama, Documentary
    'gloomy': '18,27,9648', // Drama, Horror, Mystery
    'humorous': '35', // Comedy
    'melancholy': '18,10749', // Drama, Romance
    'idyllic': '10751,14,12', // Family, Fantasy, Adventure
    'chill': '35,12,16', // Comedy, Adventure, Animation
    'romantic': '10749,35', // Romance, Comedy
    'weird': '878,14,27', // Sci-Fi, Fantasy, Horror
    'tense': '53,80,28', // Thriller, Crime, Action
    'sleepy': '99,36', // Documentary, History (Slower paced)
    'angry': '28,80,10752', // Action, Crime, War
    'fearful': '27,53', // Horror, Thriller
    'lonely': '18', // Drama (focus on singular character studies often)
    'thoughtful': '878,18,9648', // Sci-Fi, Drama, Mystery
    'thrill-seeking': '28,12,53', // Action, Adventure, Thriller
    'playful': '35,16,10751', // Comedy, Animation, Family
};

export async function POST(request: Request) {
    try {
        if (!TMDB_KEY) {
            return NextResponse.json({ error: "TMDB API Key Missing" }, { status: 500 });
        }

        const body = await request.json();
        const { mood } = body;

        if (!mood || !MOOD_GENRES[mood]) {
            return NextResponse.json({ error: "Invalid or missing mood" }, { status: 400 });
        }

        const genreIds = MOOD_GENRES[mood];

        // 1. Discover movies with these genres (fetch a random page to ensure variety)
        const randomPage = Math.floor(Math.random() * 10) + 1; // Pages 1-10
        const discoverUrl = `${BASE_URL}/discover/movie?api_key=${TMDB_KEY}&with_genres=${genreIds}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${randomPage}&vote_count.gte=100`;

        const discoverRes = await fetch(discoverUrl);
        const discoverData = await discoverRes.json();
        const movies = discoverData.results;

        if (!movies || movies.length === 0) {
            return NextResponse.json({ error: "No movies found for this mood" }, { status: 404 });
        }

        // 2. Pick a random movie from the results
        const randomIndex = Math.floor(Math.random() * movies.length);
        const selectedMovie = movies[randomIndex];

        // 3. Fetch detailed info AND videos (trailers) for the selected movie
        // We use append_to_response to get videos in a single call
        const detailUrl = `${BASE_URL}/movie/${selectedMovie.id}?api_key=${TMDB_KEY}&language=en-US&append_to_response=videos,release_dates`;
        const detailRes = await fetch(detailUrl);
        const movieDetails = await detailRes.json();

        // 4. Find the YouTube trailer key
        let trailerKey = null;
        if (movieDetails.videos && movieDetails.videos.results) {
            const trailer = movieDetails.videos.results.find(
                (vid: any) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
            );
            if (trailer) trailerKey = trailer.key;
        }

        // 5. Extract certification (rating like PG-13)
        let certification = "NR";
        if (movieDetails.release_dates && movieDetails.release_dates.results) {
            const usRelease = movieDetails.release_dates.results.find((r: any) => r.iso_3166_1 === "US");
            if (usRelease && usRelease.release_dates && usRelease.release_dates[0]) {
                 certification = usRelease.release_dates[0].certification || "NR";
            }
        }

        // 6. Construct final response payload
        const finalPayload = {
            id: movieDetails.id,
            title: movieDetails.title,
            overview: movieDetails.overview,
            release_date: movieDetails.release_date,
            runtime: movieDetails.runtime,
            vote_average: movieDetails.vote_average,
            genres: movieDetails.genres.map((g: any) => g.name),
            poster_path: movieDetails.poster_path,
            backdrop_path: movieDetails.backdrop_path,
            trailer_key: trailerKey,
            certification: certification
        };

        return NextResponse.json(finalPayload);

    } catch (error: any) {
        console.error("Mood API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}