# Moodify Setup Guide

## 🚀 Quick Start

Follow these steps to get Moodify running with full Spotify integration:

### 1. API Keys Setup

#### Google AI (Gemini) API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

#### Spotify API Credentials
1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in:
   - **App Name**: Moodify
   - **App Description**: AI-powered mood-based playlist generator
   - **Website**: http://localhost:3000
   - **Redirect URI**: Leave blank (not needed for Client Credentials flow)
5. Save the app
6. Copy your **Client ID** and **Client Secret**

### 2. Environment Setup

Create a `.env.local` file in your project root with:

```env
GOOGLE_API_KEY=your_google_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

## 🎵 Features Overview

- **Latest Music**: Only tracks from 2024-2025
- **Spotify Integration**: Album art, previews, direct links
- **AI-Powered**: Gemini AI generates mood-based playlists
- **Multi-Platform**: Both Spotify and YouTube links
- **Responsive**: Works on desktop and mobile

## 🔧 Troubleshooting

**Spotify API Issues:**
- Ensure your Client ID and Secret are correct
- Check that your Spotify app is not in development mode restrictions

**Google AI Issues:**
- Make sure your API key has Gemini API access enabled
- Check API quota limits in Google Cloud Console

**General Issues:**
- Clear browser cache and restart development server
- Check console for detailed error messages

## 📱 Usage Tips

1. Try different moods: "energetic", "chill", "workout", "romantic"
2. Use the recent playlists sidebar to quickly access previous generations
3. Click album artwork to see larger images
4. Use preview buttons to sample tracks before opening in Spotify
