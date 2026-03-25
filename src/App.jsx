import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { searchTracks, getCharts, getMoodPlaylist, MOODS, POPULAR_ARTISTS, searchArtist } from './api';
import AIDJPanel from './AIDJPanel';

const LikedContext = createContext();

function LikedProvider({ children }) {
  const [likedSongs, setLikedSongs] = useState(() => {
    const saved = localStorage.getItem('likedSongs');
    return saved ? JSON.parse(saved) : [];
  });
  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem('playlists');
    return saved ? JSON.parse(saved) : [
      { id: 'liked', name: 'Liked Songs', emoji: '❤️', tracks: [], color: 'from-red-500 to-pink-500' },
      { id: 'favorites', name: 'Favorites', emoji: '⭐', tracks: [], color: 'from-yellow-500 to-orange-500' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const isLiked = (trackId) => likedSongs.some(t => t.id === trackId);

  const toggleLike = (track) => {
    setLikedSongs(prev => {
      if (prev.some(t => t.id === track.id)) {
        return prev.filter(t => t.id !== track.id);
      }
      return [...prev, track];
    });
  };

  const createPlaylist = (name) => {
    const colors = [
      'from-violet-500 to-purple-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-amber-500',
      'from-pink-500 to-rose-500',
    ];
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      emoji: '🎵',
      tracks: [],
      color: colors[playlists.length % colors.length]
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  const addToPlaylist = (playlistId, track) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.tracks.some(t => t.id === track.id)) {
        return { ...p, tracks: [...p.tracks, track] };
      }
      return p;
    }));
  };

  const removeFromPlaylist = (playlistId, trackId) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, tracks: p.tracks.filter(t => t.id !== trackId) };
      }
      return p;
    }));
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  return (
    <LikedContext.Provider value={{ likedSongs, playlists, isLiked, toggleLike, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist }}>
      {children}
    </LikedContext.Provider>
  );
}

function useLiked() {
  return useContext(LikedContext);
}

export default function App() {
  return (
    <LikedProvider>
      <AppContent />
    </LikedProvider>
  );
}

function AppContent() {
  const [tracks, setTracks] = useState([]);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIDJ, setShowAIDJ] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [volume, setVolume] = useState(80);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('none');
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(null);
  
  const audioRef = useRef(new Audio());
  const mainRef = useRef(null);

  const currentTrack = queue[currentIndex];
  const { likedSongs, playlists, isLiked, toggleLike, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist } = useLiked();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume / 100;
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProgress(audio.currentTime);
    });
    audio.addEventListener('ended', handleNext);
    return () => audio.removeEventListener('ended', handleNext);
  }, [volume]);

  const loadInitialData = async () => {
    setLoading(true);
    const data = await getCharts();
    setTracks(data);
    setQueue(data);
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    const data = await searchTracks(searchQuery);
    setTracks(data);
    setQueue(data);
    setCurrentIndex(0);
    setLoading(false);
    setCurrentView('search');
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const playTrack = useCallback((track, trackIndex) => {
    const index = typeof trackIndex === 'number' ? trackIndex : queue.findIndex(t => t.id === track.id);
    setCurrentIndex(index);
    setProgress(0);
    if (track.preview) {
      audioRef.current.src = track.preview;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Play error:', e));
    }
    setIsPlaying(true);
  }, [queue]);

  const togglePlay = useCallback(() => {
    if (!currentTrack || !audioRef.current) return;
    
    if (audioRef.current.paused) {
      if (audioRef.current.src) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else if (currentTrack.preview) {
        audioRef.current.src = currentTrack.preview;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const handleNext = () => {
    let nextIndex;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (repeat === 'all') {
      nextIndex = (currentIndex + 1) % queue.length;
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else {
      setIsPlaying(false);
      return;
    }
    playTrack(queue[nextIndex], nextIndex);
  };

  const handlePrev = () => {
    if (progress > 3) {
      audioRef.current.currentTime = 0;
      setProgress(0);
    } else if (currentIndex > 0) {
      playTrack(queue[currentIndex - 1], currentIndex - 1);
    }
  };

  const handleAIDJStart = (playlist) => {
    setQueue(playlist.tracks);
    setCurrentIndex(0);
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0], 0);
    }
    setCurrentView('home');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-black/50 p-5 flex flex-col border-r border-white/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-fuchsia-500/30">
              <span className="text-xl">🎵</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Vibe Stream</h1>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">with AI DJ</p>
            </div>
          </div>

          <nav className="space-y-1 mb-6">
            <button 
              onClick={() => { setCurrentView('home'); loadInitialData(); }}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all ${currentView === 'home' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </button>
            <button 
              onClick={() => setCurrentView('search')}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${currentView === 'search' ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </button>
          </nav>

          {/* AI DJ Button */}
          <button
            onClick={() => setShowAIDJ(true)}
            className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-fuchsia-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div>
                <p className="font-bold">AI DJ</p>
                <p className="text-xs text-white/70">Your personal curator</p>
              </div>
            </div>
          </button>

          {/* Playlists */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider px-4">Playlists</p>
              <button 
                onClick={() => setShowCreatePlaylist(true)}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
            <div className="space-y-1">
              {playlists.map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => { setSelectedPlaylist(playlist); setCurrentView('playlist'); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                  <span className="text-lg">{playlist.emoji}</span>
                  <span className="truncate">{playlist.name}</span>
                  {playlist.id !== 'liked' && (
                    <span className="ml-auto text-xs text-zinc-600">{playlist.tracks.length}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <main ref={mainRef} className="flex-1 bg-gradient-to-b from-zinc-900/50 via-black to-black overflow-y-auto">
          {/* Search Bar */}
          <div className="sticky top-0 z-20 bg-gradient-to-b from-black via-black/95 to-transparent pb-6 pt-6 px-8">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative max-w-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search for songs, artists..."
                  className="w-full bg-white/10 border border-white/10 rounded-full px-5 py-3 pl-12 text-sm placeholder:text-zinc-500 focus:outline-none focus:border-fuchsia-500/50 focus:bg-white/15 transition-all"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <button onClick={handleSearch} className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform">Search</button>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-32">
            {currentView === 'home' && <HomeView tracks={tracks} queue={queue} currentTrack={currentTrack} isPlaying={isPlaying} onPlay={playTrack} onAddToPlaylist={(track) => setShowAddToPlaylist(track)} />}
            {currentView === 'search' && <SearchView tracks={tracks} currentTrack={currentTrack} isPlaying={isPlaying} onPlay={playTrack} onAddToPlaylist={(track) => setShowAddToPlaylist(track)} />}
            {currentView === 'playlist' && selectedPlaylist && (
              <PlaylistView playlist={selectedPlaylist} currentTrack={currentTrack} isPlaying={isPlaying} onPlay={playTrack} onRemove={(trackId) => removeFromPlaylist(selectedPlaylist.id, trackId)} />
            )}
          </div>
        </main>
      </div>

      {/* Player Bar */}
      <PlayerBar 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        progress={progress}
        volume={volume}
        shuffle={shuffle}
        repeat={repeat}
        onTogglePlay={togglePlay}
        onNext={handleNext}
        onPrev={handlePrev}
        onVolumeChange={setVolume}
        onShuffle={() => setShuffle(!shuffle)}
        onRepeat={() => setRepeat(repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none')}
        onLike={() => currentTrack && toggleLike(currentTrack)}
        isLiked={currentTrack && isLiked(currentTrack.id)}
        onOpenAIDJ={() => setShowAIDJ(true)}
      />

      {/* Modals */}
      {showAIDJ && <AIDJPanel onClose={() => setShowAIDJ(false)} onStartSession={handleAIDJStart} />}
      {showCreatePlaylist && <CreatePlaylistModal onClose={() => setShowCreatePlaylist(false)} onCreate={(name) => { createPlaylist(name); setShowCreatePlaylist(false); }} />}
      {showAddToPlaylist && <AddToPlaylistModal track={showAddToPlaylist} onClose={() => setShowAddToPlaylist(null)} />}
    </div>
  );
}

function HomeView({ tracks, queue, currentTrack, isPlaying, onPlay, onAddToPlaylist }) {
  const { likedSongs, playlists } = useLiked();
  const [moodFilter, setMoodFilter] = useState(null);
  const [moodTracks, setMoodTracks] = useState([]);
  const [loadingMood, setLoadingMood] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artistTracks, setArtistTracks] = useState([]);

  const fetchMoodPlaylist = async (mood) => {
    setLoadingMood(true);
    const data = await getMoodPlaylist(mood);
    setMoodTracks(data);
    setMoodFilter(mood);
    setLoadingMood(false);
  };

  const handleArtistClick = async (artist) => {
    setSelectedArtist(artist.name);
    const data = await searchArtist(artist.name);
    setArtistTracks(data);
  };


  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 to-pink-600/90" />
        <div className="relative flex items-center gap-6">
          <div className="w-32 h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl shadow-2xl">
            🎵
          </div>
          <div>
            <p className="text-sm font-medium text-white/60 uppercase tracking-wider mb-1">Welcome Back</p>
            <h1 className="text-4xl font-bold mb-2">Discover Your Sound</h1>
            <p className="text-white/70 max-w-md">Curated playlists powered by AI, personalized for your mood</p>
          </div>
        </div>
      </div>
      {/* Popular Artists */}
      <div>
        <h2 className="text-xl font-bold mb-4">Popular Artists</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {POPULAR_ARTISTS.slice(0, 24).map((artist) => (
            <button
              key={artist.name}
              onClick={() => handleArtistClick(artist)}
              className={`group cursor-pointer transition-all hover:scale-105 ${
                selectedArtist === artist.name ? 'scale-105' : ''
              }`}
            >
              <div className="relative aspect-square mb-3">
                <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl ring-2 ring-white/10 group-hover:ring-fuchsia-500/50 transition-all">
                  <img 
                    src={artist.image} 
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white">' + artist.name.charAt(0) + '</div>';
                    }}
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/20 group-hover:bg-black/0 transition-all flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                  <div className="w-10 h-10 rounded-full bg-fuchsia-500 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-center truncate group-hover:text-fuchsia-400 transition-colors text-sm">{artist.name}</h3>
            </button>
          ))}
        </div>
      </div>

      {/* Artist Tracks */}
      {selectedArtist && artistTracks.length > 0 && (
        <div>
          <div className="flex items-center gap-4 mb-6 bg-gradient-to-r from-fuchsia-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-4">
            <img 
              src={POPULAR_ARTISTS.find(a => a.name === selectedArtist)?.image} 
              alt={selectedArtist}
              className="w-32 h-32 rounded-full shadow-2xl object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Artist</p>
              <h2 className="text-3xl font-bold mb-2">{selectedArtist}</h2>
              <p className="text-zinc-400">{artistTracks.length} songs</p>
            </div>
            <button 
              onClick={() => { 
                if (artistTracks.length > 0) onPlay(artistTracks[0], artistTracks);
                setIsPlaying(true);
              }}
              className="ml-auto px-8 py-3 bg-fuchsia-500 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Play All
            </button>
            <button 
              onClick={() => { setSelectedArtist(null); setArtistTracks([]); }}
              className="text-zinc-400 hover:text-white p-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="space-y-1">
            {artistTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i + 1} onPlay={() => onPlay(track, artistTracks)} />
            ))}
          </div>
      {/* End Artist Tracks */}
        </div>
      )}
      {/* Quick Mood Filters */}
      <div>
        <h2 className="text-xl font-bold mb-4">Quick Vibe</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {MOODS.map(mood => (
            <button
              key={mood.id}
              onClick={() => fetchMoodPlaylist(mood.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-full border transition-all ${
                moodFilter === mood.id
                  ? `bg-gradient-to-r ${mood.color} border-transparent text-white`
                  : 'border-white/20 bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <span className="mr-2">{mood.emoji}</span>
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Tracks */}
      {moodFilter && (
        <div>
          <h2 className="text-xl font-bold mb-4 capitalize">{moodFilter} Mix</h2>
          {loadingMood ? (
            <div className="flex items-center justify-center h-40"><div className="w-10 h-10 border-2 border-fuchsia-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {moodTracks.slice(0, 12).map(track => (
                <TrackCard key={track.id} track={track} onPlay={() => onPlay(track, moodTracks)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Top Charts */}
      <div>
        <h2 className="text-xl font-bold mb-4">Top Charts</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.slice(0, 12).map((track, i) => (
            <TrackCard key={track.id} track={track} index={i + 1} onPlay={() => onPlay(track, tracks)} />
          ))}
        </div>
      </div>

      {/* Liked Songs Preview */}
      {likedSongs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Liked Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {likedSongs.slice(0, 6).map(track => (
              <TrackCard key={track.id} track={track} onPlay={() => onPlay(track, likedSongs)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SearchView({ tracks, currentTrack, isPlaying, onPlay }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Search Results</h1>
      {tracks.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No results found</div>
      ) : (
        <div className="space-y-1">
          {tracks.map((track, i) => (
            <TrackRow key={track.id} track={track} index={i + 1} isPlaying={isPlaying && currentTrack?.id === track.id} onPlay={() => onPlay(track, i)} />
          ))}
        </div>
      )}
    </div>
  );
}

function PlaylistView({ playlist, currentTrack, isPlaying, onPlay, onRemove }) {
  const tracks = playlist.id === 'liked' ? [] : playlist.tracks;
  const { likedSongs } = useLiked();
  const displayTracks = playlist.id === 'liked' ? likedSongs : tracks;

  return (
    <div>
      <div className="flex items-end gap-6 mb-8">
        <div className={`w-56 h-56 rounded-2xl bg-gradient-to-br ${playlist.color} flex items-center justify-center shadow-2xl`}>
          <span className="text-7xl">{playlist.emoji}</span>
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-zinc-400 mb-1">Playlist</p>
          <h1 className="text-5xl font-bold mb-2">{playlist.name}</h1>
          <p className="text-zinc-400">{displayTracks.length} songs</p>
        </div>
      </div>
      
      {displayTracks.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          {playlist.id === 'liked' ? 'Songs you like will appear here' : 'Add songs to this playlist'}
        </div>
      ) : (
        <div className="space-y-1">
          {displayTracks.map((track, i) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={i + 1} 
              isPlaying={isPlaying && currentTrack?.id === track.id} 
              onPlay={() => onPlay(track, displayTracks)}
              showRemove={playlist.id !== 'liked'}
              onRemove={() => onRemove(track.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TrackCard({ track, index, onPlay }) {
  const { isLiked, toggleLike } = useLiked();
  const liked = isLiked(track.id);

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-square mb-3 rounded-xl overflow-hidden shadow-lg">
        <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button onClick={onPlay} className="w-14 h-14 rounded-full bg-fuchsia-500 flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </button>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        >
          <span className={liked ? 'text-red-500' : 'text-white'}>{liked ? '❤️' : '🤍'}</span>
        </button>
        {index && <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-xs font-bold">{index}</span>}
      </div>
      <h3 className="font-semibold truncate group-hover:text-fuchsia-400 transition-colors">{track.title}</h3>
      <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
    </div>
  );
}

function TrackRow({ track, index, isPlaying, onPlay, showRemove, onRemove }) {
  const { isLiked, toggleLike } = useLiked();

  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group ${isPlaying ? 'bg-fuchsia-500/15' : 'hover:bg-white/5'}`}>
      <span className="w-8 text-center text-zinc-500 group-hover:hidden">{index}</span>
      {!isPlaying && <svg onClick={onPlay} className="w-5 h-5 text-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
      {isPlaying && <div className="flex items-end gap-0.5 h-4"><span className="w-1 bg-fuchsia-500 rounded-full animate-bounce" style={{height:'40%',animationDelay:'0ms'}}/><span className="w-1 bg-fuchsia-500 rounded-full animate-bounce" style={{height:'100%',animationDelay:'150ms'}}/><span className="w-1 bg-fuchsia-500 rounded-full animate-bounce" style={{height:'60%',animationDelay:'300ms'}}/><span className="w-1 bg-fuchsia-500 rounded-full animate-bounce" style={{height:'80%',animationDelay:'450ms'}}/></div>}
      <img src={track.albumArt} alt="" className="w-12 h-12 rounded-lg object-cover" />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold truncate ${isPlaying ? 'text-fuchsia-400' : ''}`}>{track.title}</p>
        <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
      </div>
      <span className="text-sm text-zinc-500 tabular-nums">{Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2,'0')}</span>
      <button onClick={() => toggleLike(track)} className="text-lg opacity-0 group-hover:opacity-100 transition-opacity">{isLiked(track.id) ? '❤️' : '🤍'}</button>
      {showRemove && <button onClick={onRemove} className="text-zinc-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">🗑️</button>}
    </div>
  );
}

function PlayerBar({ currentTrack, isPlaying, progress, volume, shuffle, repeat, onTogglePlay, onNext, onPrev, onVolumeChange, onShuffle, onRepeat, onLike, isLiked, onOpenAIDJ }) {
  return (
    <div className="h-24 bg-black/95 border-t border-white/10 backdrop-blur-xl">
      <div className="h-full flex items-center px-6">
        <div className="w-72 flex items-center gap-4">
          {currentTrack ? (
            <>
              <img src={currentTrack.albumArt} alt="" className={`w-14 h-14 rounded-lg shadow-lg ${isPlaying ? 'animate-pulse' : ''}`} />
              <div className="min-w-0">
                <p className="font-semibold truncate max-w-48">{currentTrack.title}</p>
                <p className="text-sm text-zinc-400 truncate max-w-48">{currentTrack.artist}</p>
              </div>
              <button onClick={onLike} className="text-xl ml-2 hover:scale-110 transition-transform">{isLiked ? '❤️' : '🤍'}</button>
            </>
          ) : <p className="text-zinc-500">Select a track</p>}
        </div>

        <div className="flex-1 flex flex-col items-center max-w-2xl mx-auto">
          <div className="flex items-center gap-6 mb-2">
            <button onClick={onShuffle} className={`text-lg transition-all ${shuffle ? 'text-fuchsia-500' : 'text-zinc-400 hover:text-white'}`}><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg></button>
            <button onClick={onPrev} className="text-white hover:text-fuchsia-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg></button>
            <button onClick={onTogglePlay} disabled={!currentTrack} className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 shadow-lg">
              {isPlaying ? <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
            </button>
            <button onClick={onNext} className="text-white hover:text-fuchsia-400"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg></button>
            <button onClick={onRepeat} className={`text-lg transition-all ${repeat !== 'none' ? 'text-fuchsia-500' : 'text-zinc-400 hover:text-white'}`}>
              {repeat === 'one' ? <span className="text-xs">1</span> : null}<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/></svg>
            </button>
          </div>
          <div className="w-full flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-10 text-right">{Math.floor(progress / 60)}:{(Math.floor(progress) % 60).toString().padStart(2,'0')}</span>
            <div className="flex-1 h-1 bg-white/20 rounded-full"><div className="h-full bg-white rounded-full" style={{width: `${currentTrack ? (progress / currentTrack.duration) * 100 : 0}%`}}/></div>
            <span className="text-xs text-zinc-500 w-10">{currentTrack ? `${Math.floor(currentTrack.duration / 60)}:${(currentTrack.duration % 60).toString().padStart(2,'0')}` : '0:00'}</span>
          </div>
        </div>

        <div className="w-72 flex items-center justify-end gap-3">
          <button onClick={onOpenAIDJ} className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 font-medium text-sm hover:scale-105 transition-transform flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            AI DJ
          </button>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => onVolumeChange(Number(e.target.value))} className="w-24 accent-white cursor-pointer" />
          <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
        </div>
      </div>
    </div>
  );
}

function CreatePlaylistModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h2 className="text-xl font-bold mb-4">Create Playlist</h2>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Playlist name..." className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-fuchsia-500" />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/20">Cancel</button>
          <button onClick={() => name && onCreate(name)} disabled={!name} className="flex-1 py-3 rounded-xl bg-fuchsia-500 font-semibold disabled:opacity-50">Create</button>
        </div>
      </div>
    </div>
  );
}

function AddToPlaylistModal({ track, onClose }) {
  const { playlists, addToPlaylist } = useLiked();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-zinc-900 rounded-2xl p-6 w-full max-w-md border border-white/10">
        <h2 className="text-xl font-bold mb-4">Add to Playlist</h2>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {playlists.filter(p => p.id !== 'liked').map(playlist => (
            <button key={playlist.id} onClick={() => { addToPlaylist(playlist.id, track); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
              <span className="text-xl">{playlist.emoji}</span>
              <span>{playlist.name}</span>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 rounded-xl border border-white/20 text-zinc-400">Cancel</button>
      </div>
    </div>
  );
}
