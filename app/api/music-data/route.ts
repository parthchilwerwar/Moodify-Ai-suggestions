import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyTrack, enrichTracksWithSpotify } from '../../../lib/spotify';
import { searchMultipleYouTubeTracks } from '../../../lib/youtube';

export async function POST(request: NextRequest) {
  try {
    const { tracks } = await request.json();

    if (!tracks || !Array.isArray(tracks)) {
      return NextResponse.json({ error: 'Invalid tracks data' }, { status: 400 });
    }

    // Step 1: Enrich with Spotify data
    let enrichedTracks;
    try {
      enrichedTracks = await enrichTracksWithSpotify(tracks);
    } catch (spotifyError) {
      enrichedTracks = tracks.map(track => ({ ...track, spotify: null }));
    }

    // Step 2: Enrich with YouTube data
    try {
      const youtubeEnrichedTracks = await searchMultipleYouTubeTracks(enrichedTracks);
      
      // Merge Spotify and YouTube data
      const finalTracks = youtubeEnrichedTracks.map((track, index) => ({
        ...track,
        spotify: enrichedTracks[index]?.spotify || null,
      }));

      // Count successful enrichments
      const spotifySuccesses = finalTracks.filter(track => track.spotify !== null).length;
      const youtubeSuccesses = finalTracks.filter(track => track.youtube !== null).length;
      
      console.log(`Enrichment complete: ${spotifySuccesses}/${tracks.length} Spotify, ${youtubeSuccesses}/${tracks.length} YouTube`);

      return NextResponse.json({ 
        tracks: finalTracks
      });

    } catch (youtubeError) {
      console.warn('YouTube enrichment failed:', youtubeError);
      
      // Return just Spotify data if YouTube fails
      return NextResponse.json({ 
        tracks: enrichedTracks
      });
    }

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
