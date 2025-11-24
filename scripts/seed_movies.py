import requests
import pandas as pd
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
import time

from dotenv import load_dotenv
import os

# Load keys from the file in the parent directory
load_dotenv('../.env') 

# Now you can use os.getenv
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# --- CONFIGURATION ---
TMDB_API_KEY = "fbbd0d456f9283e9dc152d45d6f317fb"
SUPABASE_URL = "https://tyfimrezstouwscytmoh.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5ZmltcmV6c3RvdXdzY3l0bW9oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzkwOTM3MiwiZXhwIjoyMDc5NDg1MzcyfQ.cghsWC7iq_OsjxK8mdx3XklaRycjfdjmSwL9ecOhdv4" # Must be the Service Role Key!

# --- 2. DEBUG CHECK (CRUCIAL) ---
# This will tell us immediately if the key is loaded
if not TMDB_API_KEY:
    print("❌ ERROR: TMDB_API_KEY is missing! Check your .env.local file.")
    exit()
else:
    print(f"✅ API Key Loaded: {TMDB_API_KEY[:5]}...")

if not SUPABASE_KEY:
    print("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing!")
    exit()

# --- 3. SETUP CLIENTS ---
print("Loading AI Model (This takes a moment)...")
model = SentenceTransformer('all-MiniLM-L6-v2')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- SETUP ---
print("Loading AI Model...")
model = SentenceTransformer('all-MiniLM-L6-v2')
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_credits(movie_id):
    """Fetch Director and Top 3 Cast members"""
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/credits?api_key={TMDB_API_KEY}"
    try:
        data = requests.get(url).json()
        
        # Get Director
        director = next((crew['name'] for crew in data.get('crew', []) if crew['job'] == 'Director'), "Unknown")
        
        # Get Top 3 Cast
        cast = [actor['name'] for actor in data.get('cast', [])[:3]]
        
        return director, cast
    except:
        return "Unknown", []

def fetch_and_process_movies():
    movies_data = []
    print("Fetching top movies from TMDB...")
    
    # Fetch 5 pages (100 movies)
    for page in range(1, 6): 
        url = f"https://api.themoviedb.org/3/movie/top_rated?api_key={TMDB_API_KEY}&language=en-US&page={page}"
        response = requests.get(url).json()
        
        # ADD THIS DEBUG BLOCK:
        if 'results' not in response:
            print("❌ TMDB Error Response:", response)
            break
            
      
        
        for item in response['results']:
            movie_id = item['id']
            
            # 1. Get Extra Details (Director/Cast)
            director, cast = get_credits(movie_id)
            
            # 2. Create the "AI Soup"
            # This text is what makes the recommendation smart.
            combined_text = (
                f"Title: {item['title']}. "
                f"Overview: {item['overview']} "
                f"Genres: {item['genre_ids']}. "
                f"Director: {director}. "
                f"Starring: {', '.join(cast)}."
            )
            
            movies_data.append({
                "tmdb_id": movie_id,
                "title": item['title'],
                "overview": item['overview'],
                "poster_path": item['poster_path'],
                "vote_average": item['vote_average'],
                "genres": item['genre_ids'], # Simplified for now
                "director": director,
                "cast_members": cast,
                "combined_text": combined_text
            })
            print(f"Processed: {item['title']} (Dir: {director})")
            
        time.sleep(0.2) 
        
    return pd.DataFrame(movies_data)

def generate_and_upload():
    df = fetch_and_process_movies()
    
    print(f"Generating AI Vectors for {len(df)} movies...")
    # Generate vectors from the rich text
    embeddings = model.encode(df['combined_text'].tolist())
    
    print("Uploading to Supabase...")
    for index, row in df.iterrows():
        movie_payload = {
            "tmdb_id": row['tmdb_id'],
            "title": row['title'],
            "overview": row['overview'],
            "poster_path": row['poster_path'],
            "vote_average": row['vote_average'],
            "genres": row['genres'],
            "director": row['director'],
            "cast_members": row['cast_members'],
            "embedding": embeddings[index].tolist()
        }
        
        try:
            supabase.table("movies").upsert(movie_payload, on_conflict="tmdb_id").execute()
        except Exception as e:
            print(f"Error uploading {row['title']}: {e}")

if __name__ == "__main__":
    generate_and_upload()
    print("Database populated with Smart Data!")