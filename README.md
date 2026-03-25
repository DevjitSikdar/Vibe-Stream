# Vibe Stream 🎵

> A modern, feature-rich music streaming web application built with React, styled with Tailwind CSS, and powered by the iTunes Search API.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Getting Started](#-getting-started)
5. [Available Scripts](#-available-scripts)
6. [API Reference](#-api-reference)
7. [Component Overview](#-component-overview)
8. [Customization](#-customization)
9. [Known Limitations](#-known-limitations)
10. [Future Improvements](#-future-improvements)
11. [Mobile Deployment](#-mobile-deployment)
12. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🎵 Core Music Features

| Feature | Description |
|---------|-------------|
| **Music Search** | Search any song, artist, or album using iTunes Search API |
| **Popular Artists** | Browse 41+ popular artists with their profile photos |
| **Artist Pages** | Click any artist to see their top songs and play them instantly |
| **Mood Playlists** | 8 mood-based playlists: Chill, Focus, Party, Workout, Romantic, Sad, Hype, Late Night |
| **AI DJ** | AI-powered playlist curation based on your mood and preferences |
| **Liked Songs** | Heart your favorite songs and access them anytime |
| **Custom Playlists** | Create unlimited playlists to organize your music |
| **Charts** | View top trending songs and chartbusters |

### 🎛️ Music Player Features

| Feature | Description |
|---------|-------------|
| **Play/Pause** | Control playback with visual feedback and animations |
| **Previous/Next** | Navigate through your queue seamlessly |
| **Shuffle Mode** | Randomize playback order for variety |
| **Repeat Modes** | Three modes: No Repeat → Repeat All → Repeat One |
| **Volume Control** | Adjustable volume slider (0-100%) |
| **Progress Bar** | Visual progress with current time and total duration |
| **Like Button** | Quick access to like/unlike the current track |

### 🎨 UI/UX Features

| Feature | Description |
|---------|-------------|
| **Responsive Design** | Works perfectly on desktop, tablet, and mobile devices |
| **Dark Theme** | Easy on the eyes with modern dark aesthetic |
| **Gradient Accents** | Beautiful violet-to-pink gradient themes |
| **Smooth Animations** | Hover effects, transitions, and micro-interactions |
| **Horizontal Scroll** | Smooth scrolling for artists, moods, and track lists |
| **Grid Layout** | Responsive grid for track cards |
| **Modal Dialogs** | Clean modal popups for playlist creation |

---

## 🛠 Tech Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.2.0 | UI library for building interactive components |
| **Vite** | ^5.1.4 | Fast build tool and development server |
| **Tailwind CSS** | ^3.4.1 | Utility-first CSS framework for styling |

### Build & Development

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **npm** | 8+ | Package manager for dependencies |

### External Services

| Service | Purpose |
|---------|---------|
| **iTunes Search API** | Music search, artist data, album art, audio previews |

### Mobile (Optional)

| Technology | Purpose |
|------------|---------|
| **Capacitor** | Convert web app to native mobile application |
| **@capacitor/android** | Android platform support for APK builds |

---

## 📁 Project Structure

```
vibe-stream/
├── android/                    # Capacitor Android project (generated)
├── dist/                      # Production build output
├── node_modules/              # npm dependencies
├── src/                       # Source code directory
│   ├── api.js                # iTunes API integration & data functions
│   ├── App.jsx               # Main application with all UI components
│   ├── AIDJPanel.jsx         # AI DJ feature panel component
│   ├── aiDj.js               # AI DJ logic and algorithms
│   ├── index.css             # Global styles and Tailwind imports
│   └── main.jsx              # React application entry point
├── index.html                 # HTML entry point
├── package.json               # Project metadata and dependencies
├── tailwind.config.js         # Tailwind CSS configuration
├── postcss.config.js          # PostCSS configuration
├── vite.config.js             # Vite build configuration
├── capacitor.config.json      # Capacitor mobile configuration
└── README.md                  # Project documentation
```

### 📄 Source File Details

| File | Purpose | Key Exports |
|------|---------|-------------|
| `api.js` | Handles all iTunes API calls and data fetching | `searchTracks()`, `searchArtist()`, `getCharts()`, `getMoodPlaylist()`, `POPULAR_ARTISTS`, `MOODS`, `GENRES` |
| `App.jsx` | Main app component with all UI and state management | `App`, `HomeView`, `SearchView`, `PlaylistView`, `PlayerBar`, `TrackCard`, `TrackRow` |
| `AIDJPanel.jsx` | AI DJ interface with mood selection | AI-powered playlist generation UI |
| `aiDj.js` | AI playlist curation logic and algorithms | Playlist curation and recommendation algorithms |
| `index.css` | Global styles, Tailwind base, custom utilities | Scrollbar styling, custom classes |
| `main.jsx` | React entry point | Renders App component to DOM |

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** version 18 or higher
- **npm** version 8 or higher (comes bundled with Node.js)

### Installation

**Step 1: Navigate to the project directory**

```bash
cd /path/to/vibe-stream
```

**Step 2: Install all dependencies**

```bash
npm install
```

**Step 3: Start the development server**

```bash
npm run dev
```

**Step 4: Open in your browser**

```
http://localhost:5173
```

The development server will automatically reload when you make changes to the code.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot module replacement (HMR) |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally before deployment |
| `npx cap sync android` | Sync web assets to Android project |
| `npx cap open android` | Open Android project in Android Studio |

---

## 📡 API Reference

### iTunes Search API

**Base URL:** `https://itunes.apple.com`

#### Search Tracks

```
GET /search?term={query}&media=music&limit=50&entity=song
```

**Response Fields:**

| Field | Description | Example |
|-------|-------------|---------|
| `trackId` | Unique track identifier | `123456789` |
| `trackName` | Song title | `"Shape of You"` |
| `artistName` | Artist name | `"Ed Sheeran"` |
| `collectionName` | Album name | `"÷ (Deluxe)"` |
| `artworkUrl100` | Album artwork URL | `"https://is1-ssl.mzstatic.com/..."` |
| `trackTimeMillis` | Duration in milliseconds | `233713` |
| `previewUrl` | 30-second audio preview URL | `"https://audio-ssl.itunes.apple.com/..."` |
| `primaryGenreName` | Music genre | `"Pop"` |

### Custom API Functions

```javascript
// Search for tracks by query
const tracks = await searchTracks('Taylor Swift');

// Search for specific artist and get their songs
const artistTracks = await searchArtist('Drake');

// Get trending/chart songs
const charts = await getCharts();

// Get mood-based playlist
const moodTracks = await getMoodPlaylist('chill');
// Options: 'chill', 'party', 'workout', 'focus', 'romantic', 'sad', 'hype', 'lateNight'

// Get popular artists list
const artists = POPULAR_ARTISTS;

// Get available mood options
const moods = MOODS;
```

---

## 🧩 Component Overview

### Main Components (App.jsx)

| Component | Description | Props |
|-----------|-------------|-------|
| `App` | Root component that wraps the entire application | - |
| `AppContent` | Main layout containing sidebar, main content area, and player bar | - |
| `HomeView` | Home page with hero banner, popular artists, moods, and charts | `tracks`, `queue`, `currentTrack`, `isPlaying`, `onPlay` |
| `SearchView` | Displays search results in a list format
