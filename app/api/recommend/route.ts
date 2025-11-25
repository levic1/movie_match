import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json(); // Safely parse body
    const { userId } = body;

    if (!userId) {
        return NextResponse.json({ error: "User ID missing" }, { status: 400 });
    }

    // 1. Get the movies the user LIKED
    const { data: history, error: fetchError } = await supabase
        .from('swipes')
        .select('movie_id, movies(embedding)')
        .eq('user_id', userId)
        .eq('is_like', true)
        .limit(20);

    if (fetchError) {
        console.error("Fetch Error:", fetchError);
        throw new Error(fetchError.message);
    }

    // --- COLD START (New User or No Likes) ---
    if (!history || history.length === 0) {
        console.log("Cold start for user:", userId);
        const { data: randomMovies } = await supabase
            .from('movies')
            .select('*')
            .limit(10);
        return NextResponse.json(randomMovies || []);
    }

    // --- THE ALGORITHM ---
    
    // 2. Extract vectors safely
    const vectors: number[][] = history
        .map((item: any) => {
            if (!item.movies || !item.movies.embedding) return null;
            // Handle both string format and raw array format
            return typeof item.movies.embedding === 'string' 
                ? JSON.parse(item.movies.embedding) 
                : item.movies.embedding;
        })
        .filter((v) => v !== null); // Filter out bad data

    if (vectors.length === 0) {
        // Fallback if vectors are broken
        const { data: fallback } = await supabase.from('movies').select('*').limit(10);
        return NextResponse.json(fallback);
    }

    // 3. Calculate Average Vector
    const vectorSize = vectors[0].length; 
    const userVector = new Array(vectorSize).fill(0);

    for (const vec of vectors) {
        for (let i = 0; i < vectorSize; i++) {
            userVector[i] += vec[i];
        }
    }
    const avgUserVector = userVector.map(val => val / vectors.length);

    // 4. Call RPC
    const { data: recommendations, error: rpcError } = await supabase.rpc('match_movies', {
        query_embedding: avgUserVector, 
        match_threshold: 0.1, // Lowered threshold to ensure results
        match_count: 10,
        user_id_input: userId 
    });

    if (rpcError) {
        console.error("RPC Error:", rpcError);
        return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    return NextResponse.json(recommendations);

  } catch (error: any) {
    console.error("CRITICAL BACKEND ERROR:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}