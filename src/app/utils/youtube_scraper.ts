import { getTranscript } from 'youtube-transcript-api';
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();
const API_KEY = process.env.YOUTUBE_DATA_API_KEY;
if (!API_KEY) {
  throw new Error('YOUTUBE_DATA_API_KEY is not set in the environment variables');
}

export async function get_youtube_transcription(video_id: string): Promise<string> {
  try {
    const transcript = await getTranscript(video_id);
    return transcript.map((entry: { text: string }) => entry.text).join(' ');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching YouTube transcription: ${error.message}`);
    } else {
      throw new Error('Unknown error occurred while fetching YouTube transcription');
    }
  }
}

export async function get_video_title(video_id: string): Promise<string | null> {
  const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
  });

  try {
    const response = await youtube.videos.list({
      part: ['snippet'],
      id: [video_id],
    });
    if (response.data.items && response.data.items.length > 0) {
      const title = response.data.items[0].snippet?.title;
      if (title) {
        return title;
      }
    }
    throw new Error('No video found or title is missing');
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching video title: ${error.message}`);
    } else {
      throw new Error('Error fetching video title: Unknown error');
    }
  }
}

export function sanitize_filename(filename: string): string {
  return filename.replace(/[\\/*?:"<>|]/g, '');
}