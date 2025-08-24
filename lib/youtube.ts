import { google } from 'googleapis';

// Initialize YouTube API client
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export interface YouTubeVideo {
  id: string;
  title: string;
  artist: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  publishedAt: string;
  viewCount: string;
  duration: string;
}

export interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  totalResults: number;
}

// Search for music videos on YouTube
export async function searchYouTubeMusic(query: string, maxResults = 10): Promise<YouTubeSearchResult> {
  try {
    // Removed verbose logging
    
    if (!process.env.YOUTUBE_API_KEY) {
      return { videos: [], totalResults: 0 };
    }
    
    // Search for videos with proper parameter typing
    const searchResponse = await youtube.search.list({
      part: 'snippet' as any,
      q: `${query} music video song`,
      type: 'video' as any,
      maxResults: maxResults,
      videoCategoryId: '10', // Music category
      order: 'relevance' as any,
      safeSearch: 'none' as any,
    });

    if (!searchResponse.data?.items || !Array.isArray(searchResponse.data.items)) {
      return { videos: [], totalResults: 0 };
    }

    // Get video IDs for additional details
    const videoIds = searchResponse.data.items
      .map((item: any) => item.id?.videoId)
      .filter((id: any): id is string => Boolean(id) && typeof id === 'string');
    
    if (videoIds.length === 0) {
      return { videos: [], totalResults: 0 };
    }
    
    // Get video statistics and content details
    const videosResponse = await youtube.videos.list({
      part: 'statistics,contentDetails,snippet' as any,
      id: videoIds,
    });

    const videos: YouTubeVideo[] = [];
    
    if (videosResponse.data?.items && Array.isArray(videosResponse.data.items)) {
      for (const video of videosResponse.data.items) {
        if (video.id && video.snippet) {
          // Extract artist and title from the video title
          const fullTitle = video.snippet.title || '';
          const { title, artist } = extractTitleAndArtist(fullTitle);
          
          videos.push({
            id: video.id,
            title: title,
            artist: artist,
            description: video.snippet.description || '',
            thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || '',
            videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
            publishedAt: video.snippet.publishedAt || '',
            viewCount: (video.statistics as any)?.viewCount || '0',
            duration: (video.contentDetails as any)?.duration || '',
          });
        }
      }
    }

    return {
      videos,
      totalResults: searchResponse.data?.pageInfo?.totalResults || 0,
    };
  } catch (error) {
    return { videos: [], totalResults: 0 };
  }
}

// Helper function to extract title and artist from YouTube video title
function extractTitleAndArtist(fullTitle: string): { title: string; artist: string } {
  // Common patterns in YouTube music video titles
  const patterns = [
    /^(.+?)\s*-\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/,  // Artist - Title
    /^(.+?)\s*–\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/,  // Artist – Title (em dash)
    /^(.+?)\s*by\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/i, // Title by Artist
    /^(.+?)\s*\|\s*(.+?)(?:\s*\(.*\))?(?:\s*\[.*\])?$/,  // Artist | Title
  ];

  for (const pattern of patterns) {
    const match = fullTitle.match(pattern);
    if (match) {
      // Check if first group looks like artist (usually proper nouns)
      const first = match[1].trim();
      const second = match[2].trim();
      
      // If pattern includes "by", swap the order
      if (pattern.source.includes('by')) {
        return { title: first, artist: second };
      } else {
        return { title: second, artist: first };
      }
    }
  }

  // Fallback: assume the whole title is the song title
  return { title: fullTitle, artist: 'Unknown Artist' };
}

// Search for multiple tracks on YouTube
export async function searchMultipleYouTubeTracks(tracks: Array<{ title: string; artist: string }>): Promise<Array<{ title: string; artist: string; youtube?: YouTubeVideo | undefined }>> {
  const enrichedTracks: Array<{ title: string; artist: string; youtube?: YouTubeVideo | undefined }> = [];
  
  for (const track of tracks) {
    try {
      const searchQuery = `${track.title} ${track.artist}`;
      const result = await searchYouTubeMusic(searchQuery, 1);
      
      enrichedTracks.push({
        ...track,
        youtube: result.videos[0] || undefined,
      });
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to search YouTube for: ${track.title} by ${track.artist}`, error);
      enrichedTracks.push({
        ...track,
        youtube: undefined,
      });
    }
  }
  
  return enrichedTracks;
}

// Get trending music videos
export async function getTrendingMusicVideos(maxResults = 20): Promise<YouTubeVideo[]> {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return [];
    }
    
    const response = await youtube.videos.list({
      part: 'snippet,statistics,contentDetails' as any,
      chart: 'mostPopular' as any,
      videoCategoryId: '10', // Music category
      regionCode: 'US',
      maxResults: maxResults,
    });

    const videos: YouTubeVideo[] = [];
    
    if (response.data?.items && Array.isArray(response.data.items)) {
      for (const video of response.data.items) {
        if (video.id && video.snippet) {
          const fullTitle = video.snippet.title || '';
          const { title, artist } = extractTitleAndArtist(fullTitle);
          
          videos.push({
            id: video.id,
            title,
            artist,
            description: video.snippet.description || '',
            thumbnailUrl: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.default?.url || '',
            videoUrl: `https://www.youtube.com/watch?v=${video.id}`,
            publishedAt: video.snippet.publishedAt || '',
            viewCount: (video.statistics as any)?.viewCount || '0',
            duration: (video.contentDetails as any)?.duration || '',
          });
        }
      }
    }

    return videos;
  } catch (error) {
    return [];
  }
}

export default youtube;
