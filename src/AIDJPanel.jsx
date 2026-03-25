import React, { useState, useEffect, useRef } from 'react';
import AIDJEngine from './aiDj';
import { MOODS, GENRES } from './api';

export default function AIDJPanel({ onClose, onStartSession }) {
  const [step, setStep] = useState(0);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const djEngine = useRef(new AIDJEngine());

  const handleMoodSelect = (moodId) => {
    setSelectedMood(moodId);
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(g => g !== genreId)
        : [...prev, genreId]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      const result = await djEngine.current.generatePlaylist(selectedMood, selectedGenres);
      setPlaylist(result);
      setLoadingProgress(100);
      
      setTimeout(() => {
        setIsGenerating(false);
        setStep(2);
      }, 500);
    } catch (error) {
      console.error('Error generating playlist:', error);
      setIsGenerating(false);
    }

    clearInterval(progressInterval);
  };

  const handleStartSession = () => {
    if (playlist) {
      onStartSession(playlist);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-b from-zinc-900 via-black to-black border border-white/10 shadow-2xl animate-modal-in">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-pink-600/10" />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-xl shadow-fuchsia-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl blur opacity-30 -z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  AI DJ
                </h2>
                <p className="text-sm text-zinc-500">Your personal music curator</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all hover:scale-105"
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex gap-2 mt-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step 
                    ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500' 
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 max-h-[60vh] overflow-y-auto">
          {step === 0 && (
            <MoodStep
              selectedMood={selectedMood}
              onSelect={handleMoodSelect}
              onNext={() => setStep(1)}
            />
          )}

          {step === 1 && (
            <GenreStep
              selectedGenres={selectedGenres}
              onToggle={handleGenreToggle}
              onBack={() => setStep(0)}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              progress={loadingProgress}
            />
          )}

          {step === 2 && playlist && (
            <PlaylistPreview
              playlist={playlist}
              onStart={handleStartSession}
              onBack={() => setStep(1)}
              onRegenerate={handleGenerate}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

function MoodStep({ selectedMood, onSelect, onNext }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">How are you feeling?</h3>
        <p className="text-zinc-500 text-sm">Select your current vibe</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 ${
              selectedMood === mood.id
                ? 'border-fuchsia-500 bg-fuchsia-500/20 scale-98'
                : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 rounded-2xl`} />
            <div className="relative">
              <span className="text-3xl mb-2 block">{mood.emoji}</span>
              <span className="font-semibold text-sm block text-white">{mood.name}</span>
              <span className="text-xs text-zinc-500 block mt-1">{mood.description}</span>
            </div>
            {selectedMood === mood.id && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-fuchsia-500 flex items-center justify-center shadow-lg">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!selectedMood}
        className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
          selectedMood
            ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-lg hover:shadow-fuchsia-500/25 hover:scale-[1.02]'
            : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function GenreStep({ selectedGenres, onToggle, onBack, onGenerate, isGenerating, progress }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Preferred Genres</h3>
        <p className="text-zinc-500 text-sm">Select all that apply (optional)</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {GENRES.map((genre) => (
          <button
            key={genre.id}
            onClick={() => onToggle(genre.id)}
            className={`px-5 py-2.5 rounded-full border-2 transition-all duration-200 ${
              selectedGenres.includes(genre.id)
                ? 'bg-fuchsia-500/20 border-fuchsia-500 text-white'
                : 'border-white/20 bg-white/5 text-zinc-400 hover:border-white/40 hover:text-white'
            }`}
          >
            <span className="mr-2">{genre.emoji}</span>
            {genre.name}
          </button>
        ))}
      </div>

      {isGenerating && (
        <div className="space-y-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-zinc-500 animate-pulse">
            {progress < 50 ? 'Analyzing your vibe...' : progress < 90 ? 'Curating your mix...' : 'Almost ready...'}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 rounded-2xl border border-white/20 text-zinc-400 hover:bg-white/5 transition-all"
        >
          Back
        </button>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex-1 py-4 rounded-2xl font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-lg hover:shadow-fuchsia-500/25 transition-all disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : '✨ Generate Mix'}
        </button>
      </div>
    </div>
  );
}

function PlaylistPreview({ playlist, onStart, onBack, onRegenerate }) {
  const mood = playlist.moodData;

  return (
    <div className="space-y-6">
      {/* DJ Card */}
      <div className={`p-5 rounded-2xl bg-gradient-to-br ${mood?.color || 'from-violet-600 to-fuchsia-600'} bg-opacity-20 border border-white/10`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
            <span className="text-2xl">{mood?.emoji}</span>
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/60 uppercase tracking-wider">Now Playing</p>
            <p className="text-lg font-bold">{mood?.name || 'Custom'} Mix</p>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all ${
                  i < playlist.energyLevel ? 'bg-fuchsia-400' : 'bg-white/20'
                }`}
                style={{ height: `${8 + i * 2}px` }}
              />
            ))}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-black/30 rounded-xl">
          <p className="text-sm text-white/80 italic">"{playlist.djThoughts}"</p>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
        {playlist.tracks.slice(0, 10).map((track, i) => (
          <div key={track.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
            <span className="w-6 text-center text-zinc-500 text-sm">{i + 1}</span>
            <img src={track.albumArt} alt="" className="w-10 h-10 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">{track.title}</p>
              <p className="text-xs text-zinc-500 truncate">{track.artist}</p>
            </div>
            <span className="text-xs text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {track.transitionNote}
            </span>
          </div>
        ))}
        {playlist.tracks.length > 10 && (
          <p className="text-center text-sm text-zinc-500 py-2">
            +{playlist.tracks.length - 10} more tracks
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onRegenerate}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/20 text-zinc-400 hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate
        </button>
        <button
          onClick={onStart}
          className="flex-1 py-4 rounded-2xl font-semibold bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          Start Session
        </button>
      </div>
    </div>
  );
}
