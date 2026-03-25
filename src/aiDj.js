import { MOODS } from './api';

const TRANSITIONS = {
  smooth: [
    "Smooth transition incoming...",
    "Gentle flow into this one",
    "Taking you somewhere beautiful",
    "Seamless vibes ahead",
  ],
  energyUp: [
    "Building up the energy",
    "Cranking it up a notch",
    "Time to turn it up",
    "Escalating the intensity",
  ],
  energyDown: [
    "Cooling things down",
    "Time for a breather",
    "Gentle descent incoming",
    "Winding it down",
  ],
  surprise: [
    "Hidden gem coming up",
    "Trust me on this one",
    "Something special for you",
    "This one's unexpected",
  ],
  genreBlend: [
    "Smooth genre blend",
    "Nice stylistic shift",
    "Taking you somewhere new",
    "Genre fusion incoming",
  ],
  popular: [
    "You know this one!",
    "Absolute banger!",
    "Fan favorite right here",
    "Everyone loves this track",
  ],
};

const DJ_THOUGHTS = {
  chill: [
    "Easy vibes only tonight 🌊",
    "Keeping it silky smooth",
    "Relaxed mode activated",
    "Smooth sailing ahead",
  ],
  focus: [
    "In the zone we go 🎯",
    "Pure concentration mode",
    "Nothing but the music",
    "Deep work, let's go",
  ],
  party: [
    "This party's JUST getting started! 🎉",
    "Dance floor's open!",
    "Nobody leaves until we say so!",
    "Let's get it started!",
  ],
  workout: [
    "Feel the burn! 💪",
    "Maximum effort mode",
    "Own every single rep",
    "Push your limits!",
  ],
  romantic: [
    "For the lovers tonight 💕",
    "Setting the perfect mood",
    "Warm vibes only",
    "Love is in the air",
  ],
  sad: [
    "Sometimes we need this 🎭",
    "Music heals, I promise",
    "Letting it all out",
    "It's okay to feel this",
  ],
  hype: [
    "WE ARE NOT OKAY! 🔥",
    "PEAK CHAOS MODE",
    "This is unhinged behavior",
    "NO BRAKES!",
  ],
  lateNight: [
    "When the world sleeps 🌙",
    "Perfect for these hours",
    "Late night special",
    "The city's quiet, we aren't",
  ],
};

class AIDJEngine {
  constructor() {
    this.mood = null;
    this.energyLevel = 5;
    this.recentArtists = new Set();
    this.recentTracks = new Set();
    this.playedCount = 0;
    this.playedArtists = new Map();
  }

  setMood(moodId) {
    this.mood = moodId;
    const moodData = MOODS.find(m => m.id === moodId);
    this.energyLevel = moodData?.energy || 5;
    this.recentArtists.clear();
    this.recentTracks.clear();
    this.playedCount = 0;
    this.playedArtists.clear();
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  selectNextTrack(currentTrack, availableTracks) {
    if (availableTracks.length === 0) return null;
    
    const shuffled = this.shuffleArray(availableTracks);
    
    // Prioritize popular tracks from top artists
    const scored = shuffled.map(track => {
      let score = 50;
      
      // Popularity bonus
      if (track.popularity >= 8) {
        score += 30;
      } else if (track.popularity >= 6) {
        score += 15;
      }
      
      // Is this a top artist?
      if (track.isTopArtist) {
        score += 25;
        
        // Check if we haven't played this artist recently
        const artistPlays = this.playedArtists.get(track.artist) || 0;
        if (artistPlays === 0) {
          score += 20;
        } else if (artistPlays < 2) {
          score += 10;
        }
      }
      
      // Avoid recently played tracks
      if (this.recentTracks.has(track.id)) {
        score -= 50;
      }
      
      // Energy matching
      const energyDiff = Math.abs(track.energy - this.energyLevel);
      score += (10 - energyDiff) * 4;
      
      // Gradually adjust energy
      if (this.playedCount > 5 && Math.random() < 0.3) {
        score += (track.energy - this.energyLevel) * 5;
      }
      
      // Small chance for surprise
      if (this.playedCount > 8 && Math.random() < 0.15 && !this.recentTracks.has(track.id)) {
        score += 25;
      }
      
      return { track, score };
    });

    scored.sort((a, b) => b.score - a.score);
    
    // Pick from top 3 to add randomness
    const topCandidates = scored.slice(0, 4);
    const selected = topCandidates[Math.floor(Math.random() * topCandidates.length)];
    
    return selected?.track || scored[0]?.track;
  }

  getTransitionNote(currentEnergy, nextEnergy, track) {
    const diff = nextEnergy - currentEnergy;
    
    // Comment on popular tracks
    if (track?.popularity >= 8) {
      return TRANSITIONS.popular[Math.floor(Math.random() * TRANSITIONS.popular.length)];
    }
    
    if (Math.abs(diff) <= 2) {
      return TRANSITIONS.smooth[Math.floor(Math.random() * TRANSITIONS.smooth.length)];
    }
    if (diff > 2) {
      return TRANSITIONS.energyUp[Math.floor(Math.random() * TRANSITIONS.energyUp.length)];
    }
    if (diff < -2) {
      return TRANSITIONS.energyDown[Math.floor(Math.random() * TRANSITIONS.energyDown.length)];
    }
    
    if (Math.random() < 0.2) {
      return TRANSITIONS.surprise[Math.floor(Math.random() * TRANSITIONS.surprise.length)];
    }
    
    return TRANSITIONS.smooth[Math.floor(Math.random() * TRANSITIONS.smooth.length)];
  }

  getDJThoughts() {
    const thoughts = DJ_THOUGHTS[this.mood] || DJ_THOUGHTS.chill;
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }

  recordPlay(track) {
    this.recentTracks.add(track.id);
    this.playedCount++;
    
    const artistPlays = this.playedArtists.get(track.artist) || 0;
    this.playedArtists.set(track.artist, artistPlays + 1);
    
    // Keep recent history limited
    if (this.recentTracks.size > 25) {
      const tracksArray = Array.from(this.recentTracks);
      this.recentTracks = new Set(tracksArray.slice(-20));
    }
    
    // Gradual energy drift
    this.energyLevel = Math.max(1, Math.min(10, 
      this.energyLevel * 0.7 + track.energy * 0.3
    ));
  }

  recordSkip() {
    this.energyLevel = Math.max(1, this.energyLevel - 1);
  }

  async generatePlaylist(mood, genrePrefs = []) {
    this.setMood(mood);
    
    const { getMoodPlaylist } = await import('./api');
    let tracks = await getMoodPlaylist(mood);
    
    // Ensure we have enough tracks
    if (tracks.length < 15) {
      const { getCharts } = await import('./api');
      const chartTracks = await getCharts();
      tracks = [...tracks, ...chartTracks];
    }
    
    // Remove duplicates
    const seen = new Set();
    tracks = tracks.filter(t => {
      const key = `${t.title}-${t.artist}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Sort by popularity
    tracks.sort((a, b) => (b.popularity || 5) - (a.popularity || 5));
    
    // Take top tracks and shuffle
    tracks = this.shuffleArray(tracks.slice(0, 30));
    
    // Build playlist
    const playlist = [];
    let currentEnergy = this.energyLevel;
    
    for (let i = 0; i < Math.min(20, tracks.length); i++) {
      const track = this.selectNextTrack(
        i > 0 ? playlist[i - 1] : null,
        tracks.slice(i)
      );
      
      if (track) {
        const transitionNote = i === 0 
          ? "Starting with a banger! 🔥" 
          : this.getTransitionNote(
              playlist[i - 1]?.energy || currentEnergy,
              track.energy,
              track
            );
        
        playlist.push({
          ...track,
          transitionNote,
          queuePosition: i + 1,
        });
        
        this.recordPlay(track);
        currentEnergy = track.energy;
      }
    }
    
    return {
      mood,
      moodData: MOODS.find(m => m.id === mood),
      energyLevel: Math.round(this.energyLevel),
      djThoughts: this.getDJThoughts(),
      tracks: playlist,
    };
  }
}

export default AIDJEngine;
