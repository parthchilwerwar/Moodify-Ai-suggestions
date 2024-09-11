import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);


export async function POST(request: NextRequest) {
  const { mood } = await request.json();
  const cleanedMood = mood.replace(/\uD83D[\uDE00-\uDE4F]/g, '').trim();

  const fixedPlaylistLength = 5; 

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate a playlist of ${fixedPlaylistLength} songs that match the mood: ${cleanedMood}. Include a diverse mix of:
    1. Songs that specifically match the given mood or theme
    2. Classic hits
    3. Popular songs from the last 5 years
    4. Very recent releases (songs from the current year)
    5. At least one song released within the last week

    Return the result as a JSON array of objects, each with title, artist, and searchQuery properties. The searchQuery should be a URL-encoded string combining the title and artist for a YouTube search. Include songs from various countries and languages, ensuring a balance between mood-specific tracks, older hits, recent popular songs, and the latest releases. For very recent songs and those from the last week, include the release year. Do not include any markdown formatting or additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    let playlist;
    try {
      playlist = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse JSON:', text);
      throw new Error('Invalid response format from Gemini API');
    }
  
    if (!Array.isArray(playlist) || playlist.length !== fixedPlaylistLength || !playlist.every(track => track.title && track.artist)) {
      throw new Error('Invalid playlist structure from Gemini API');
    }

    playlist = playlist.map(track => ({
      ...track,
      searchQuery: encodeURIComponent(`${track.title} ${track.artist}`)
    }));

    return NextResponse.json({ playlist });
  } catch (error) {
    console.error('Error generating playlist:', error);
    return NextResponse.json({ error: 'Failed to generate playlist' }, { status: 500 });
  }
}