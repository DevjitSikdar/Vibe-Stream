const BASE_URL = 'https://itunes.apple.com';

export const POPULAR_ARTISTS = [
  { name: 'Justin Bieber', image: 'https://i.scdn.co/image/ab6761610000e5eb9a33ac2f3002e2c0c1b5f1f' },
  { name: 'Drake', image: 'https://i.scdn.co/image/ab6761610000e5eb7ce5a2ceec7376c3c6f77b5c' },
  { name: 'The Weeknd', image: 'https://i.scdn.co/image/ab6761610000e5eb6a4782d2b5c5d3f4e5a6b7c' },
  { name: 'Taylor Swift', image: 'https://i.scdn.co/image/ab6761610000e5eb8c5a2d6c6c3e7b8d9f0a1b2c' },
  { name: 'Bad Bunny', image: 'https://i.scdn.co/image/ab6761610000e5eb8d1c5a2d3e4f5a6b7c8d9e0' },
  { name: 'Dua Lipa', image: 'https://i.scdn.co/image/ab6761610000e5eb9f2a3b4c5d6e7f8a9b0c1d2' },
  { name: 'Ed Sheeran', image: 'https://i.scdn.co/image/ab6761610000e5eb8c1a2b3c4d5e6f7a8b9c0d1' },
  { name: 'Billie Eilish', image: 'https://i.scdn.co/image/ab6761610000e5eb9d2e3f4a5b6c7d8e9f0a1b2' },
  { name: 'Harry Styles', image: 'https://i.scdn.co/image/ab6761610000e5eb7e3f4a5b6c7d8e9f0a1b2c3' },
  { name: 'Beyonce', image: 'https://i.scdn.co/image/ab6761610000e5eb8f4a5b6c7d8e9f0a1b2c3d4' },
  { name: 'Ariana Grande', image: 'https://i.scdn.co/image/ab6761610000e5eb9a5b6c7d8e9f0a1b2c3d4e5' },
  { name: 'Post Malone', image: 'https://i.scdn.co/image/ab6761610000e5eb6b6c7d8e9f0a1b2c3d4e5f6' },
  { name: 'Doja Cat', image: 'https://i.scdn.co/image/ab6761610000e5eb7c7d8e9f0a1b2c3d4e5f6a7' },
  { name: 'Kendrick Lamar', image: 'https://i.scdn.co/image/ab6761610000e5eb8d8e9f0a1b2c3d4e5f6a7b8' },
  { name: 'SZA', image: 'https://i.scdn.co/image/ab6761610000e5eb5e9f0a1b2c3d4e5f6a7b8c9' },
  { name: 'Olivia Rodrigo', image: 'https://i.scdn.co/image/ab6761610000e5eb6f0a1b2c3d4e5f6a7b8c9d0' },
  { name: 'Travis Scott', image: 'https://i.scdn.co/image/ab6761610000e5eb9a1b2c3d4e5f6a7b8c9d0e1' },
  { name: 'Usher', image: 'https://i.scdn.co/image/ab6761610000e5eb8b2c3d4e5f6a7b8c9d0e1f2' },
  { name: 'Bruno Mars', image: 'https://i.scdn.co/image/ab6761610000e5eb7c3d4e5f6a7b8c9d0e1f2a3' },
  { name: 'Rihanna', image: 'https://i.scdn.co/image/ab6761610000e5eb9d4e5f6a7b8c9d0e1f2a3b4' },
  { name: 'Adele', image: 'https://i.scdn.co/image/ab6761610000e5eb8e5f6a7b8c9d0e1f2a3b4c5' },
  { name: 'Coldplay', image: 'https://i.scdn.co/image/ab6761610000e5eb9f6a7b8c9d0e1f2a3b4c5d6' },
  { name: 'The Chainsmokers', image: 'https://i.scdn.co/image/ab6761610000e5eb8a7b8c9d0e1f2a3b4c5d6e7' },
  { name: 'Shawn Mendes', image: 'https://i.scdn.co/image/ab6761610000e5eb9b8c9d0e1f2a3b4c5d6e7f8' },
  { name: 'Lady Gaga', image: 'https://i.scdn.co/image/ab6761610000e5eb7c9d0e1f2a3b4c5d6e7f8a9' },
  { name: 'Katy Perry', image: 'https://i.scdn.co/image/ab6761610000e5eb8d0e1f2a3b4c5d6e7f8a9b0' },
  { name: 'Eminem', image: 'https://i.scdn.co/image/ab6761610000e5eb9e1f2a3b4c5d6e7f8a9b0c1' },
  { name: 'Maroon 5', image: 'https://i.scdn.co/image/ab6761610000e5eb8f2a3b4c5d6e7f8a9b0c1d2' },
  { name: 'Shakira', image: 'https://i.scdn.co/image/ab6761610000e5eb9a3b4c5d6e7f8a9b0c1d2e3' },
  { name: 'Selena Gomez', image: 'https://i.scdn.co/image/ab6761610000e5eb6b4c5d6e7f8a9b0c1d2e3f4' },
  { name: 'Miley Cyrus', image: 'https://i.scdn.co/image/ab6761610000e5eb7c5d6e7f8a9b0c1d2e3f4a5' },
  { name: 'BTS', image: 'https://i.scdn.co/image/ab6761610000e5eb8d6e7f8a9b0c1d2e3f4a5b6' },
  { name: 'Blackpink', image: 'https://i.scdn.co/image/ab6761610000e5eb9e7f8a9b0c1d2e3f4a5b6c7' },
  { name: 'Lil Baby', image: 'https://i.scdn.co/image/ab6761610000e5eb8f8a9b0c1d2e3f4a5b6c7d8' },
  { name: 'Ice Spice', image: 'https://i.scdn.co/image/ab6761610000e5eb9a9b0c1d2e3f4a5b6c7d8e9' },
  { name: 'Metro Boomin', image: 'https://i.scdn.co/image/ab6761610000e5eb8b0c1d2e3f4a5b6c7d8e9f0' },
  { name: 'Morgan Wallen', image: 'https://i.scdn.co/image/ab6761610000e5eb7c1d2e3f4a5b6c7d8e9f0a1' },
  { name: 'Peso Pluma', image: 'https://i.scdn.co/image/ab6761610000e5eb8d2e3f4a5b6c7d8e9f0a1b2' },
  { name: 'J Balvin', image: 'https://i.scdn.co/image/ab6761610000e5eb9e3f4a5b6c7d8e9f0a1b2c3' },
  { name: 'David Guetta', image: 'https://i.scdn.co/image/ab6761610000e5eb8f4a5b6c7d8e9f0a1b2c3d4' },
  { name: 'Calvin Harris', image: 'https://i.scdn.co/image/ab6761610000e5eb9a5b6c7d8e9f0a1b2c3d4e5' },
];

const genreEnergy = {
  'Pop': 6, 'Dance': 8, 'Hip-Hop': 7, 'R&B': 5, 'Rock': 7,
  'Alternative': 6, 'Electronic': 8, 'Jazz': 3, 'Classical': 3,
  'Country': 5, 'Latin': 8, 'Metal': 9, 'Indie': 4, 'Hip Hop': 7,
  'Soul': 4, 'Funk': 7, 'Reggae': 5, 'Blues': 3, 'World': 5,
  'K-Pop': 7, 'Latin Pop': 8, 'Urban': 6, 'trap': 7, 'rap': 7
};

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getRandomArtists(count) {
  return shuffleArray(POPULAR_ARTISTS).slice(0, count);
}

export async function searchTracks(query) {
  try {
    const response = await fetch(BASE_URL + '/search?term=' + encodeURIComponent(query) + '&media=music&limit=50&entity=song');
    const data = await response.json();
    return data.results
      .filter(t => t.previewUrl)
      .map((track, index) => {
        const genre = track.primaryGenreName || 'Pop';
        return {
          id: track.trackId || index,
          title: track.trackName,
          artist: track.artistName,
          album: track.collectionName,
          albumArt: (track.artworkUrl100 || '').replace('100x100', '300x300') || 'https://picsum.photos/seed/' + track.trackId + '/300/300',
          albumArtLarge: (track.artworkUrl100 || '').replace('100x100', '600x600') || 'https://picsum.photos/seed/' + track.trackId + '/600/600',
          duration: Math.floor(track.trackTimeMillis / 1000),
          preview: track.previewUrl,
          genre: genre.toLowerCase(),
          energy: genreEnergy[genre] || 5,
          popularity: track.trackName.includes('feat.') ? 8 : 5 + Math.floor(Math.random() * 3),
        };
      });
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function searchArtist(artistName) {
  try {
    const response = await fetch(BASE_URL + '/search?term=' + encodeURIComponent(artistName) + '&media=music&limit=10&entity=song');
    const data = await response.json();
    return data.results
      .filter(t => t.previewUrl && t.artistName.toLowerCase().includes(artistName.toLowerCase()))
      .map(track => {
        const genre = track.primaryGenreName || 'Pop';
        return {
          id: track.trackId,
          title: track.trackName,
          artist: track.artistName,
          album: track.collectionName,
          albumArt: (track.artworkUrl100 || '').replace('100x100', '300x300') || 'https://picsum.photos/seed/' + track.trackId + '/300/300',
          albumArtLarge: (track.artworkUrl100 || '').replace('100x100', '600x600') || 'https://picsum.photos/seed/' + track.trackId + '/600/600',
          duration: Math.floor(track.trackTimeMillis / 1000),
          preview: track.previewUrl,
          genre: genre.toLowerCase(),
          energy: genreEnergy[genre] || 5,
          popularity: 8,
          isTopArtist: true,
        };
      });
  } catch (error) {
    return [];
  }
}

export async function getCharts() {
  const queries = ['top hits 2024', 'chartbusters', 'hot 100', 'billboard top 50', 'most played songs'];
  const query = queries[Math.floor(Math.random() * queries.length)];
  const results = await searchTracks(query);
  return results.map(t => ({ ...t, popularity: 8 }));
}

export async function getMoodPlaylist(mood) {
  const moodQueries = {
    chill: ['chill beats', 'lofi study', 'peaceful piano', 'acoustic chill', 'Ed Sheeran', 'Taylor Swift', 'Shawn Mendes', 'Bruno Mars', 'Adele'],
    focus: ['study beats', 'concentration music', 'lofi hip hop', 'instrumental piano', 'Hans Zimmer', 'Ludovico Einaudi', 'Yiruma'],
    party: ['party dance hits', 'club bangers', 'edm drops', 'dance anthems', 'The Weeknd', 'Dua Lipa', 'Calvin Harris', 'David Guetta', 'Post Malone'],
    workout: ['workout motivation', 'gym hits', 'pump iron', 'fitness energy', 'Eminem', '50 Cent', 'Lil Pump', 'Travis Scott', 'Kendrick Lamar'],
    romantic: ['love songs 2024', 'r&b romance', 'slow jam', 'heart songs', 'Beyonce', 'John Legend', 'Alicia Keys', 'Usher', 'Chris Brown'],
    sad: ['emotional songs', 'sad ballads', 'heartbreak hits', 'melancholy', 'Adele', 'Sam Smith', 'Olivia Rodrigo', 'Billie Eilish', 'The Weeknd'],
    hype: ['turn up', 'trap bangers', 'hip hop hits', 'throwback hits', 'Drake', 'Kendrick Lamar', 'Future', 'Megan Thee Stallion', 'Cardi B'],
    lateNight: ['late night vibes', 'smooth r&b', 'night drive', 'chill hip hop', 'SZA', 'Frank Ocean', 'The Weeknd', 'Tyler The Creator', 'Labrinth'],
  };

  const queries = moodQueries[mood] || moodQueries.chill;
  const artistQueries = shuffleArray(queries).slice(0, 3);
  const queryTerms = shuffleArray(queries).slice(0, 2);
  const allTracks = [];

  for (const artist of artistQueries) {
    const tracks = await searchArtist(artist);
    allTracks.push(...tracks);
  }

  for (const term of queryTerms) {
    if (!POPULAR_ARTISTS.some(pa => term.toLowerCase().includes(pa.name.toLowerCase()))) {
      const tracks = await searchTracks(term);
      allTracks.push(...tracks);
    }
  }

  const seen = new Set();
  const unique = allTracks.filter(t => {
    const key = t.title + '-' + t.artist;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return shuffleArray(unique);
}

export async function getTopArtistsPlaylist() {
  const artists = getRandomArtists(10);
  const allTracks = [];

  for (const artist of artists) {
    const tracks = await searchArtist(artist.name);
    allTracks.push(...tracks);
    if (allTracks.length >= 40) break;
  }

  return shuffleArray(allTracks).slice(0, 30);
}

export const MOODS = [
  { id: 'chill', name: 'Chill', emoji: '😌', color: 'from-blue-500 to-cyan-400', energy: 3, description: 'Smooth and mellow' },
  { id: 'focus', name: 'Focus', emoji: '🎯', color: 'from-purple-500 to-indigo-500', energy: 4, description: 'Deep concentration' },
  { id: 'party', name: 'Party', emoji: '🎉', color: 'from-pink-500 to-rose-500', energy: 8, description: 'High energy celebration' },
  { id: 'workout', name: 'Workout', emoji: '💪', color: 'from-orange-500 to-red-500', energy: 9, description: 'Maximum intensity' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', color: 'from-red-500 to-pink-500', energy: 4, description: 'Love and warmth' },
  { id: 'sad', name: 'Melancholy', emoji: '🌧️', color: 'from-gray-600 to-slate-500', energy: 2, description: 'Let it all out' },
  { id: 'hype', name: 'Hype', emoji: '🔥', color: 'from-yellow-500 to-orange-500', energy: 10, description: 'Maximum chaos' },
  { id: 'lateNight', name: 'Late Night', emoji: '🌙', color: 'from-indigo-600 to-purple-600', energy: 5, description: 'Moonlit grooves' },
];

export const GENRES = [
  { id: 'pop', name: 'Pop', emoji: '🎤' },
  { id: 'rock', name: 'Rock', emoji: '🎸' },
  { id: 'hiphop', name: 'Hip-Hop', emoji: '🎧' },
  { id: 'electronic', name: 'Electronic', emoji: '🎛️' },
  { id: 'jazz', name: 'Jazz', emoji: '🎷' },
  { id: 'classical', name: 'Classical', emoji: '🎻' },
  { id: 'rnb', name: 'R&B', emoji: '🎶' },
  { id: 'latin', name: 'Latin', emoji: '💃' },
];
