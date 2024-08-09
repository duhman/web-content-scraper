import { YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound, VideoUnavailable } from 'youtube-transcript-api';
import { google } from 'googleapis';
import dotenv from 'dotenv';
import re from 're';

dotenv.config();
const API_KEY = process.env.YOUTUBE_DATA_API_KEY;

export async function get_youtube_transcription(video_id) {
  try {
    const transcript = await YouTubeTranscriptApi.get_transcript(video_id);
    return transcript.map(entry => entry.text).join(' ');
  } catch (error) {
    throw new Error(`Error fetching YouTube transcription: ${error.message}`);
  }
}

export async function get_video_title(video_id) {
  const youtube = google.youtube({
    version: 'v3',
    auth: API_KEY,
  });

  try {
    const response = await youtube.videos.list({
      part: 'snippet',
      id: video_id,
    });

    if (response.data.items.length > 0) {
      return response.data.items[0].snippet.title;
    } else {
      throw new Error('No video found');
    }
  } catch (error) {
    throw new Error(`Error fetching video title: ${error.message}`);
  }
}

export function sanitize_filename(filename) {
  return filename.replace(/[\\/*?:"<>|]/g, '');
}