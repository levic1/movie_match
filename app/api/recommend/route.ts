import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { userId } = await request.json();

  // 1. Get the movies the user LIKED
  const { data: history } = await supabase
    .from('swipes')
    .select('movie_id, movies(embedding)')
    .eq('user_id', userId)
    .eq('is_like', true)
    .limit(20); // Last 20 likes

  // --- COLD START (New User) ---
  // If they haven't liked anything, just give them popular movies to start.
  if (!history || history.length === 0) {
    const { data: randomMovies } = await supabase
      .from('movies')
      .select('*')
      .limit(10);
    return NextResponse.json(randomMovies);
  }

  // --- THE ALGORITHM (User Vector) ---
  
  // 2. Extract the vectors
  // Each embedding is a string "[0.1, 0.2...]", we need to parse it.
  const vectors: number[][] = history
    .map((item: any) => {
        if (typeof item.movies.embedding === 'string') {
            return JSON.parse(item.movies.embedding);
        }
        return item.movies.embedding;
    })
    .filter((v) => v);

  // 3. Calculate "Average Taste"
  // If you liked 5 Action movies and 1 Romance, your vector will lean heavily towards Action.
  const vectorSize = 384; 
  const userVector = new Array(vectorSize).fill(0);

  for (const vec of vectors) {
    for (let i = 0; i < vectorSize; i++) {
      userVector[i] += vec[i];
    }
  }
  // Divide by count to get average
  const avgUserVector = userVector.map(val => val / vectors.length);

  // 4. Find Similar Movies (Nearest Neighbors)
  // We call the 'match_movies' SQL function we created earlier
  const { data: recommendations, error } = await supabase.rpc('match_movies', {
    query_embedding: avgUserVector, 
    match_threshold: 0.3, // 0.3 is loose, 0.8 is strict
    match_count: 10,
    user_id_input: userId // Don't show movies I've already seen
  });

  if (error) {
    console.error("Rec Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(recommendations);
}