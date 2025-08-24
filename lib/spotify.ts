import SpotifyWebApi from 'spotify-web-api-node';

// Initialize Spotify API client
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Get client credentials access token
async function getAccessToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error('Error getting Spotify access token:', error);
    throw error;
  }
}

// Search for a track on Spotify
export async function searchSpotifyTrack(title: string, artist: string) {
  try {
    await getAccessToken();
    const searchQuery = `track:"${title}" artist:"${artist}"`;
    const searchResults = await spotifyApi.searchTracks(searchQuery, { limit: 1 });
    
    if (searchResults.body.tracks?.items && searchResults.body.tracks.items.length > 0) {
      const track = searchResults.body.tracks.items[0];
      return {
        spotifyId: track.id,
        spotifyUrl: track.external_urls.spotify,
        previewUrl: track.preview_url,
        popularity: track.popularity,
        releaseDate: track.album.release_date,
        albumImage: track.album.images[0]?.url,
        duration: track.duration_ms,
      };
    }
    return null;
  } catch (error) {
    console.error('Error searching Spotify:', error);
    return null;
  }
}

// Get multiple tracks with Spotify data
export async function enrichTracksWithSpotify(tracks: Array<{ title: string; artist: string }>) {
  const enrichedTracks = [];
  
  for (const track of tracks) {
    const spotifyData = await searchSpotifyTrack(track.title, track.artist);
    enrichedTracks.push({
      ...track,
      spotify: spotifyData,
    });
  }
  
  return enrichedTracks;
}

// Get trending tracks from Spotify
export async function getSpotifyTrendingTracks(limit = 20) {
  try {
    await getAccessToken();
    
    // Get featured playlists (trending/popular content)
    const playlists = await spotifyApi.getFeaturedPlaylists({ limit: 5 });
    const tracks = [];
    
    // Get tracks from the first trending playlist
    if (playlists.body.playlists.items && playlists.body.playlists.items.length > 0) {
      const playlistId = playlists.body.playlists.items[0].id;
      const playlistTracks = await spotifyApi.getPlaylistTracks(playlistId, { limit });
      
      if (playlistTracks.body.items) {
        for (const item of playlistTracks.body.items) {
          if (item.track && 'name' in item.track && item.track.artists && item.track.artists.length > 0) {
            tracks.push({
              title: item.track.name,
              artist: item.track.artists[0].name,
              spotifyId: item.track.id,
              spotifyUrl: item.track.external_urls.spotify,
              releaseYear: new Date(item.track.album.release_date).getFullYear(),
              popularity: item.track.popularity,
            });
          }
        }
      }
    }
    
    return tracks;
  } catch (error) {
    console.error('Error getting trending tracks:', error);
    return [];
  }
}

export default spotifyApi;
