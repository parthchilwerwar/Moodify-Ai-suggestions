import { NextRequest, NextResponse } from 'next/server';
import { searchSpotifyTrack, enrichTracksWithSpotify } from '../../../lib/spotify';

export async function POST(request: NextRequest) {
  try {
    const { tracks } = await request.json();

    if (!tracks || !Array.isArray(tracks)) {
      return NextResponse.json({ error: 'Invalid tracks data' }, { status: 400 });
    }

    // Enrich tracks with Spotify data
    const enrichedTracks = await enrichTracksWithSpotify(tracks);

    return NextResponse.json({ tracks: enrichedTracks });
  } catch (error) {
    console.error('Error enriching tracks with Spotify data:', error);
    return NextResponse.json({ error: 'Failed to get Spotify data' }, { status: 500 });
  }
}

// GET endpoint to search for a specific track
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  const artist = searchParams.get('artist');

  if (!title || !artist) {
    return NextResponse.json({ error: 'Title and artist are required' }, { status: 400 });
  }

  try {
    const spotifyData = await searchSpotifyTrack(title, artist);
    return NextResponse.json({ spotify: spotifyData });
  } catch (error) {
    console.error('Error searching Spotify track:', error);
    return NextResponse.json({ error: 'Failed to search Spotify' }, { status: 500 });
  }
}
