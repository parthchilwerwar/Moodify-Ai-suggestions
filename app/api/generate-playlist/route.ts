import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  const { mood } = await request.json();
  const cleanedMood = mood.replace(/\uD83D[\uDE00-\uDE4F]/g, '').trim();

  const fixedPlaylistLength = 8;

  try {
    const result = await generatePlaylistWithModel("openai/gpt-oss-120b", cleanedMood, fixedPlaylistLength);
    return result;
  } catch (error: any) {
    console.error(`Error with openai/gpt-oss-120b model:`, error.message);
    
    // Handle specific error types
    if (error.message?.includes('rate_limit')) {
      return NextResponse.json(
        { 
          error: 'API rate limit reached. Please wait a moment and try again.',
          details: 'Too many requests to AI service'
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Unable to generate playlist at the moment. Please try again later.',
        details: error.message || 'Service temporarily unavailable'
      },
      { status: 500 }
    );
  }
}

async function generatePlaylistWithModel(currentModel: string, cleanedMood: string, fixedPlaylistLength: number) {
  
    const prompt = `You are an expert music curator AI with extensive knowledge of music from 2020 to 2025. 

CRITICAL INSTRUCTIONS:
- You MUST return ONLY valid JSON - no text before or after
- You MUST return exactly ${fixedPlaylistLength} songs
- Use double quotes for ALL strings
- Do NOT use single quotes
- Do NOT add trailing commas
- Ensure all JSON syntax is perfect

REQUIRED FIELDS for each song:
- title: string (song name)
- artist: string (artist name)  
- releaseYear: number (2023-2025, no quotes around numbers)
- spotifyId: "" (empty string)
- searchQuery: string (for searching)
- reasoning: string (max 50 characters)

Return ONLY this exact JSON format:
[
  {
    "title": "Song Title",
    "artist": "Artist Name",
    "releaseYear": 2024,
    "spotifyId": "",
    "searchQuery": "Song Title Artist Name",
    "reasoning": "Matches mood perfectly"
  }
]

Generate playlist for mood: "${cleanedMood}"
Use recent popular songs from 2023-2025. Mix genres: Pop, Hip-Hop, R&B, Electronic.`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a music curator AI. ALWAYS respond with ONLY valid JSON. No explanations, no markdown formatting, no extra text. Just a pure JSON array of exactly 8 songs. Use double quotes for all strings. No trailing commas. Perfect JSON syntax only."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: currentModel,
      temperature: 0.5, // Reduced for more consistent output
      max_tokens: 3000,
      top_p: 0.9,
      stream: false
    });

    const responseText = completion.choices[0]?.message?.content?.trim();
    
    if (!responseText) {
      throw new Error('AI model returned empty response');
    }

    // Clean up the response more thoroughly
    let cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/\n?```/g, '')
      .replace(/```\n?/g, '')
      .replace(/\n?```$/g, '')
      .trim();

    // Remove any leading/trailing text that isn't part of the JSON
    const jsonStart = cleanedResponse.indexOf('[');
    const jsonEnd = cleanedResponse.lastIndexOf(']');
    
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1);
    }

    // Fix common JSON formatting issues
    cleanedResponse = cleanedResponse
      .replace(/'/g, '"')  // Replace single quotes with double quotes
      .replace(/,\s*]/g, ']')  // Remove trailing commas before closing bracket
      .replace(/,\s*}/g, '}')  // Remove trailing commas before closing brace
      .replace(/(\w+):/g, '"$1":')  // Ensure property names are quoted
      .replace(/"(\d+)"/g, '$1')  // Convert quoted numbers back to numbers
      .replace(/""(\w+)""/g, '"$1"');  // Fix double-quoted strings

    // Handle incomplete JSON by attempting to fix truncation
    if (!cleanedResponse.endsWith(']')) {
      console.log('Detected incomplete JSON response, attempting to fix...');
      
      // Try to find the last complete song object
      const lastCompleteObjectIndex = cleanedResponse.lastIndexOf('},');
      if (lastCompleteObjectIndex > -1) {
        cleanedResponse = cleanedResponse.substring(0, lastCompleteObjectIndex + 1) + ']';
      } else {
        const lastBraceIndex = cleanedResponse.lastIndexOf('}');
        if (lastBraceIndex > -1) {
          cleanedResponse = cleanedResponse.substring(0, lastBraceIndex + 1) + ']';
        } else {
          throw new Error('Could not fix incomplete JSON response');
        }
      }
    }

    // Parse the JSON with better error reporting
    let playlist;
    try {
      playlist = JSON.parse(cleanedResponse);
    } catch (parseError: any) {
      console.error(`JSON parse error:`, parseError.message);
      console.error('Raw response:', responseText);
      console.error('Cleaned response:', cleanedResponse);
      
      // Final attempt: try to manually construct valid JSON
      try {
        // Extract individual song objects using regex
        const songPattern = /\{[^{}]*"title"[^{}]*"artist"[^{}]*\}/g;
        const songMatches = cleanedResponse.match(songPattern);
        
        if (songMatches && songMatches.length > 0) {
          const validSongs = [];
          for (const songMatch of songMatches) {
            try {
              const song = JSON.parse(songMatch);
              if (song.title && song.artist) {
                validSongs.push(song);
              }
            } catch (e) {
              console.warn('Skipping invalid song object:', songMatch);
            }
          }
          
          if (validSongs.length > 0) {
            playlist = validSongs;
          } else {
            throw new Error('No valid songs could be extracted');
          }
        } else {
          throw new Error('Could not extract any song objects from response');
        }
      } catch (recoveryError: any) {
        throw new Error(`AI response parsing failed: ${parseError.message}. Recovery attempt also failed: ${recoveryError.message}`);
      }
    }

    // Validate the playlist structure
    if (!Array.isArray(playlist)) {
      throw new Error('AI response is not a valid playlist array');
    }

    if (playlist.length === 0) {
      throw new Error('AI generated an empty playlist');
    }

    // Ensure we have the right number of tracks
    if (playlist.length > fixedPlaylistLength) {
      playlist = playlist.slice(0, fixedPlaylistLength);
    }

    // Validate and clean up each track with reasoning
    const validatedPlaylist = playlist
      .filter(track => track.title && track.artist)
      .map(track => ({
        title: String(track.title).trim(),
        artist: String(track.artist).trim(),
        releaseYear: track.releaseYear || new Date().getFullYear(),
        spotifyId: track.spotifyId || '',
        searchQuery: encodeURIComponent(`${track.title} ${track.artist}`.trim()),
        reasoning: track.reasoning || 'Selected to match your mood'
      }));

    if (validatedPlaylist.length === 0) {
      throw new Error('No valid tracks found in AI response');
    }
    
    return NextResponse.json({ 
      playlist: validatedPlaylist,
      mood: cleanedMood,
      source: 'groq-ai',
      model: "openai/gpt-oss-120b"
    });
}