# 🎵 Moodify - AI-Powered Mood-Based Playlist Generator

![954b8eb8-5c25-47b6-a480-1820f1b6ec67-9](https://github.com/user-attachments/assets/a2c6c0a2-f0f7-4fc5-83a9-c8fe7b372684)

Moodify is a Next.js web application that generates personalized music playlists based on your mood using **Groq AI** and integrates with both **Spotify** and **YouTube** APIs to provide a comprehensive music discovery experience.

## ✨ Features

- **🤖 AI-Powered Playlist Generation**: Uses Groq API with Mixtral-8x7b model for intelligent song recommendations
- **🎵 Multi-Platform Integration**: Combines data from both Spotify and YouTube APIs
- **🎧 Real-time Music Data**: Fetches album covers, popularity scores, preview audio, and video content
- **📱 Recent Playlists History**: Saves your last 5 generated playlists for quick access
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🎬 Interactive UI**: Smooth animations and modern design with Framer Motion
- **😀 Smart Mood Detection**: Supports emoji inputs and natural language mood descriptions
- **🌍 International Music**: Discovers tracks from artists worldwide

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Groq API (Mixtral-8x7b-32768)
- **Music APIs**: Spotify Web API, YouTube Data API v3
- **Animations**: Framer Motion
- **Icons**: React Icons (FontAwesome)
- **Styling**: Custom CSS with neon theme

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/parthchilwerwar/Moodify-Ai-suggestions.git
cd Moodify-Ai-suggestions
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Fill in your API keys in the `.env` file:

```bash
# Groq API Configuration (Primary AI service)
GROQ_API_KEY=your_groq_api_key_here

# Google AI (Gemini) Configuration - Backup
GOOGLE_API_KEY=your_google_api_key_here

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# YouTube Data API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 4. Get Your API Keys

#### 🤖 Groq API (Primary)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_`)

#### 🎵 Spotify API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details
5. Copy the Client ID and Client Secret

#### 📺 YouTube Data API
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

#### 🧠 Google AI (Gemini) - Optional Backup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 API Endpoints

### `/api/generate-playlist`
- **Method**: POST
- **Description**: Generates a mood-based playlist using Groq AI
- **Body**: `{ mood: string }`
- **Response**: Array of track objects with titles, artists, and metadata

### `/api/music-data`
- **Method**: POST
- **Description**: Enriches tracks with Spotify and YouTube data
- **Body**: `{ tracks: Track[] }`
- **Response**: Enriched tracks with Spotify and YouTube metadata

### `/api/music-data` (GET)
- **Method**: GET
- **Description**: Search for a specific track on both platforms
- **Query**: `?title=SongTitle&artist=ArtistName`
- **Response**: Combined Spotify and YouTube data for the track

## 🎯 How It Works

1. **🎭 User Input**: User enters their current mood (e.g., "happy", "sad", "party")
2. **🤖 AI Generation**: Groq API generates 8 relevant songs matching the mood
3. **🎵 Data Enrichment**: 
   - **Spotify API** provides: Album covers, preview audio, popularity scores, release dates
   - **YouTube API** provides: Music videos, thumbnails, view counts, descriptions
4. **📱 Display**: Combined data is presented in an interactive playlist interface
5. **🎧 Interaction**: Users can:
   - Listen to 30-second Spotify previews
   - Watch YouTube music videos
   - Access direct Spotify and YouTube links
   - Save playlists to history

## 📂 Project Structure

```
my-mood-playlist/
├── app/
│   ├── api/
│   │   ├── generate-playlist/      # Groq AI playlist generation
│   │   ├── music-data/            # Combined Spotify + YouTube API
│   │   └── spotify/               # Legacy Spotify-only API
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MoodInput.tsx          # Mood input with emojis
│   │   ├── Playlist.tsx           # Enhanced with YouTube support
│   │   ├── LoadingSpinner.tsx
│   │   └── RecentPlaylistsSidebar.tsx
│   ├── globals.css                # Custom neon theme
│   ├── layout.tsx
│   └── page.tsx                   # Main application logic
├── lib/
│   ├── spotify.ts                 # Spotify API integration
│   └── youtube.ts                 # YouTube API integration
├── .env                           # Your API keys
├── .env.example                   # Template for API keys
├── README.md
└── package.json
```

## 🎨 Key Features Explained

### 🤖 AI-Powered Generation
- Uses **Groq's Mixtral-8x7b** model for fast, accurate music recommendations
- Fallback system with curated playlists for reliability
- Smart mood interpretation (handles emojis, natural language)

### 🎵 Multi-Platform Music Discovery
- **Spotify Integration**: High-quality metadata, album art, audio previews
- **YouTube Integration**: Music videos, view counts, visual content
- **Seamless Linking**: Direct access to both platforms

### 📱 User Experience
- **Responsive Design**: Works perfectly on mobile and desktop
- **Recent History**: Quick access to your last 5 playlists
- **Interactive Previews**: Play 30-second clips directly in the app
- **Smooth Animations**: Framer Motion for delightful interactions

## 🔧 Customization

### Adding More Mood Categories
Edit the fallback playlists in `/app/api/generate-playlist/route.ts`:

```typescript
const fallbackPlaylists = {
  yourMood: [
    { 
      title: 'Song Title', 
      artist: 'Artist Name', 
      releaseYear: 2024, 
      spotifyId: '', 
      searchQuery: 'encoded search' 
    }
  ]
};
```

### Modifying AI Prompts
Adjust the prompt in the Groq API call to change how the AI selects songs:

```typescript
const prompt = `Your custom prompt for ${mood} mood...`;
```

### UI Styling
Customize the appearance by editing:
- `/app/globals.css` - Global styles and neon theme
- Component files - Individual component styling with Tailwind CSS

## 🚨 Error Handling & Reliability

The application includes robust error handling:
- **🤖 Groq API Failures**: Falls back to curated playlists
- **🎵 Spotify API Issues**: Continues with YouTube data only
- **📺 YouTube API Problems**: Continues with Spotify data only
- **🌐 Network Issues**: Graceful degradation with helpful error messages
- **⚡ Rate Limiting**: Smart retry logic and request spacing

## 🌟 What's New in This Version

### Groq AI Integration
- **Faster Generation**: Groq's optimized inference for rapid playlist creation
- **Better Quality**: Mixtral-8x7b provides more relevant song recommendations
- **Cost Effective**: More generous rate limits compared to other AI services

### Dual Platform Support
- **YouTube Data**: Video thumbnails, view counts, direct video links
- **Enhanced Metadata**: Combined data from both Spotify and YouTube
- **Better Discovery**: More comprehensive music information

### Improved UX
- **Visual Enhancements**: YouTube thumbnails and video previews
- **Better Linking**: Direct video links when available
- **Statistics Display**: View counts and popularity metrics
- **Fallback System**: Always works even if APIs are down

## 📱 Mobile Experience

- **Touch-Optimized**: Large, easy-to-tap buttons
- **Responsive Layout**: Adapts to all screen sizes
- **Smooth Scrolling**: Optimized for mobile browsing
- **Fast Loading**: Efficient API calls and data caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Known Issues & Limitations

- **API Rate Limits**: Free tier limitations may affect heavy usage
- **Regional Content**: Some tracks may not be available in all regions
- **Preview Availability**: Not all tracks have Spotify preview clips

## 🚀 Future Enhancements

- [ ] User accounts and saved playlists
- [ ] Social sharing features
- [ ] Playlist export to Spotify
- [ ] More AI models and providers
- [ ] Advanced mood analysis
- [ ] Collaborative playlists

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎵 Start Discovering Music!

Transform your emotions into the perfect soundtrack with Moodify. Whether you're feeling happy, sad, energetic, or chill - we've got the perfect playlist waiting for you!

---

Made with ❤️ by [Parth Chilwerwar](https://github.com/parthchilwerwar)

**Happy listening! 🎶**
