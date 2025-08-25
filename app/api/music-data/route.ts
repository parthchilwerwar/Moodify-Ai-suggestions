import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyTrack, enrichTracksWithSpotify } from '../../../lib/spotify';
import { searchMultipleYouTubeTracks } from '../../../lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { tracks } = await request.json();

    if (!tracks || !Array.isArray(tracks)) {
      return NextResponse.json({ error: 'Invalid tracks data' }, { status: 400 });
    }

    console.log(`Enriching ${tracks.length} tracks with music platform data...`);

    // Enhanced parallel processing - search both platforms simultaneously for each track
    const enrichedTracks = await Promise.all(tracks.map(async (track, index) => {
      console.log(`Processing track ${index + 1}: "${track.title}" by "${track.artist}"`);
      
      try {
        // Search both platforms in parallel for each track
        const [spotifyResult, youtubeResult] = await Promise.allSettled([
          searchSpotifyTrack(track.title, track.artist),
          searchMultipleYouTubeTracks([track]).then(results => results[0]?.youtube)
        ]);

        let spotify = null;
        let youtube = null;

        // Handle Spotify result
        if (spotifyResult.status === 'fulfilled' && spotifyResult.value) {
          spotify = spotifyResult.value;
          console.log(`✓ Found on Spotify: "${track.title}" by "${track.artist}"`);
        } else {
          console.log(`✗ Not found on Spotify: "${track.title}" by "${track.artist}"`);
        }

        // Handle YouTube result
        if (youtubeResult.status === 'fulfilled' && youtubeResult.value) {
          youtube = youtubeResult.value;
          console.log(`✓ Found on YouTube: "${track.title}" by "${track.artist}"`);
        } else {
          console.log(`✗ Not found on YouTube: "${track.title}" by "${track.artist}"`);
        }

        return {
          ...track,
          spotify,
          youtube
        };
        
      } catch (error) {
        console.error(`Error processing track "${track.title}" by "${track.artist}":`, error);
        return {
          ...track,
          spotify: null,
          youtube: null
        };
      }
    }));

    // Count successful enrichments
    const spotifySuccesses = enrichedTracks.filter(track => track.spotify !== null).length;
    const youtubeSuccesses = enrichedTracks.filter(track => track.youtube !== null).length;
    const totalWithData = enrichedTracks.filter(track => track.spotify !== null || track.youtube !== null).length;
    
    console.log(`Enrichment complete: ${spotifySuccesses}/${tracks.length} on Spotify, ${youtubeSuccesses}/${tracks.length} on YouTube, ${totalWithData}/${tracks.length} total with data`);

    return NextResponse.json({ 
      tracks: enrichedTracks,
      stats: {
        total: tracks.length,
        spotify: spotifySuccesses,
        youtube: youtubeSuccesses,
        withData: totalWithData
      }
    });

  } catch (error) {
    console.error('Error enriching tracks:', error);
    return NextResponse.json({ 
      error: 'Failed to enrich tracks with music data', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// GET endpoint to search for a specific track on both platforms
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
  }

  try {
    console.log(`Searching for: "${title}" by "${artist}" on both platforms`);
    
    // Search both platforms simultaneously
    const [spotifyPromise, youtubePromise] = await Promise.allSettled([
      searchSpotifyTrack(title, artist),
      import('../../../lib/youtube').then(yt => yt.searchYouTubeMusic(`${title} ${artist}`, 1))
    ]);

    const result: any = {
      title,
      artist,
      spotify: null,
      youtube: null
    };

    // Handle Spotify result
    if (spotifyPromise.status === 'fulfilled') {
      result.spotify = spotifyPromise.value;
    } else {
      console.warn('Spotify search failed:', spotifyPromise.reason);
      result.spotifyError = spotifyPromise.reason?.message || 'Spotify search failed';
    }

    // Handle YouTube result
    if (youtubePromise.status === 'fulfilled') {
      const youtubeResult = youtubePromise.value;
      result.youtube = youtubeResult.videos[0] || null;
    } else {
      console.warn('YouTube search failed:', youtubePromise.reason);
      result.youtubeError = youtubePromise.reason?.message || 'YouTube search failed';
    }

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Error searching for track:', error);
    return NextResponse.json({ 
      error: 'Failed to search for track',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
