import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  const { mood } = await request.json();
  const cleanedMood = mood.replace(/\uD83D[\uDE00-\uDE4F]/g, '').trim();

  // Increase playlist length to 10 songs
  const fixedPlaylistLength = 10;

  try {
    // Add randomization to ensure different results each time
    const sessionId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    console.log(`Generating unique playlist for mood: "${cleanedMood}" (Session: ${sessionId})`);
    
    const result = await generatePlaylistWithModel("openai/gpt-oss-120b", cleanedMood, fixedPlaylistLength, sessionId);
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

async function generatePlaylistWithModel(currentModel: string, cleanedMood: string, fixedPlaylistLength: number, sessionId?: string) {
  
    // Generate a timestamp-based seed for uniqueness
    const timestamp = sessionId ? sessionId : `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // Analyze the mood input for context clues
    const currentYear = new Date().getFullYear();
    const lowerMood = cleanedMood.toLowerCase();
    const isTrendingRequest = lowerMood.includes('trending') || lowerMood.includes('popular') || lowerMood.includes('viral') || lowerMood.includes('current') || lowerMood.includes('latest');
    const hasYearContext = lowerMood.includes('2024') || lowerMood.includes('2025');
    
    // Determine year focus based on context
    let yearFocus = '';
    if (isTrendingRequest || hasYearContext || lowerMood.includes('new')) {
      yearFocus = `Focus heavily on 2024-2025 releases. Prioritize very recent songs that are trending NOW.`;
    } else {
      yearFocus = `Mix songs from 2020-2025, with emphasis on recent years (2023-2025).`;
    }
    
    const prompt = `You are an expert music curator AI with extensive knowledge of music from 2020 to 2025 from ALL OVER THE WORLD. Current date: August 25, 2025.

CRITICAL INSTRUCTIONS:
- You MUST return ONLY valid JSON - no text before or after
- You MUST return exactly ${fixedPlaylistLength} UNIQUE and DIFFERENT songs
- NEVER repeat songs from previous generations - be creative and diverse
- Use double quotes for ALL strings
- Do NOT use single quotes
- Do NOT add trailing commas
- Ensure all JSON syntax is perfect
- Each generation should have completely DIFFERENT songs, even for the same mood
- ${yearFocus}

CONTEXT ANALYSIS for "${cleanedMood}":
${isTrendingRequest ? '- User wants TRENDING/POPULAR songs - focus on viral hits and current chart-toppers from 2024-2025' : ''}
${hasYearContext ? '- User mentioned specific recent years - prioritize songs from that timeframe' : ''}

GLOBAL DIVERSITY REQUIREMENTS:
- Include songs from DIFFERENT COUNTRIES and cultures (not just English songs)
- Mix languages: English, Spanish, Korean (K-Pop), Japanese (J-Pop), Hindi, French, Portuguese, Italian, German, Arabic, etc.
- Include artists from: USA, UK, Korea, Japan, India, Latin America, Brazil, France, Germany, Nigeria, etc.
- Genres from around the world: K-Pop, J-Pop, Reggaeton, Afrobeats, Bollywood, French Pop, German Rap, Arabic Pop, etc.
- Mix mainstream international hits with regional popular songs
- Think globally about mood interpretation across cultures

RECENCY REQUIREMENTS:
- If mood suggests "trending/popular/viral/current/latest": 80% of songs should be from 2024-2025
- Otherwise: 60% from 2023-2025, 40% from 2020-2022
- NO songs older than 2020
- Focus on songs that were actually popular/trending in their respective years

REQUIRED FIELDS for each song:
- title: string (song name - must be UNIQUE, can be in any language)
- artist: string (artist name - vary the artists from different countries)  
- releaseYear: number (2020-2025, no quotes around numbers)
- spotifyId: "" (empty string)
- searchQuery: string (for searching - use romanized/English version if needed)
- reasoning: string (max 50 characters explaining mood connection)

DIVERSITY REQUIREMENTS:
- Mix different artists from different countries (don't repeat artists if possible)
- Include various global genres: K-Pop, J-Pop, Reggaeton, Afrobeats, Bollywood, French Pop, German Rap, Arabic Pop, Latin Trap, Brazilian Funk, etc.
- Include both international mainstream hits and regional favorites
- Represent at least 4-5 different countries/cultures in the playlist
- Think creatively about how different cultures express the same mood through music

Return ONLY this exact JSON format:
[
  {
    "title": "Song Title (any language)",
    "artist": "Artist Name (from any country)",
    "releaseYear": 2025,
    "spotifyId": "",
    "searchQuery": "Song Title Artist Name",
    "reasoning": "Matches mood perfectly"
  }
]

Generate GLOBALLY DIVERSE playlist for mood: "${cleanedMood}"
Session ID: ${timestamp} (use this for unique generation)
Be creative and generate FRESH, DIFFERENT songs from ALL CORNERS OF THE WORLD!
${isTrendingRequest ? 'FOCUS ON TRENDING/VIRAL SONGS FROM 2024-2025!' : 'Include songs in multiple languages and from various cultures!'}`;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a globally-minded creative music curator AI with deep knowledge of international music from 2020-2025. Current date: August 25, 2025. ALWAYS respond with ONLY valid JSON. Generate UNIQUE and DIVERSE songs from ALL AROUND THE WORLD each time, never repeating previous suggestions. Focus on variety in artists, genres, languages, and countries. When users mention "trending", "popular", "viral", "current", or specific years like "2025", prioritize very recent songs (2024-2025) that are actually trending. Include K-Pop, J-Pop, Reggaeton, Afrobeats, Bollywood, French Pop, German music, Arabic songs, Latin music, and more. Think globally! Current session: ${timestamp}`
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: currentModel,
      temperature: 0.8, // Increased for more creativity and variation
      max_tokens: 3000,
      top_p: 0.95, // Increased for more diverse outputs
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
      model: "openai/gpt-oss-120b",
      sessionId: timestamp,
      generated: new Date().toISOString()
    });
}