import { get_youtube_transcription, get_video_title, sanitize_filename } from './youtube_scraper';
import { get_article_content } from './article_scraper';
import { download_podcast, transcribe_podcast } from './podcast_scraper';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir } from 'fs/promises';
import { YoutubeTranscript } from 'youtube-transcript';

const execAsync = promisify(exec);

async function runPythonScript(scriptPath: string, args: string[]): Promise<string> {
  const { stdout, stderr } = await execAsync(`python ${scriptPath} ${args.join(' ')}`);
  if (stderr) {
    console.error(`Python script error: ${stderr}`);
    throw new Error(stderr);
  }
  return stdout;
}

async function ensureDirectoryExists(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

async function isTranscriptAvailable(videoId: string): Promise<boolean> {
  try {
    await YoutubeTranscript.fetchTranscript(videoId);
    return true;
  } catch (error) {
    return false;
  }
}

export async function process_youtube_videos(videoIds: string[]) {
  const results = [];
  for (const videoId of videoIds) {
    try {
      if (!(await isTranscriptAvailable(videoId))) {
        throw new Error('Transcript is not available for this video');
      }
      const transcription = await get_youtube_transcription(videoId);
      const title = await get_video_title(videoId);
      const filename = sanitize_filename(`${title || videoId}.txt`);
      const dirPath = path.join(process.cwd(), 'public', 'youtube');
      await ensureDirectoryExists(dirPath);
      const filePath = path.join(dirPath, filename);
      await fs.writeFile(filePath, transcription);
      results.push({ videoId, title, filePath });
    } catch (error) {
      console.error(`Error processing YouTube video ${videoId}:`, error);
      results.push({ videoId, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  }
  return results;
}

export async function process_articles(urls: string[]) {
  const results = [];
  for (const url of urls) {
    try {
      const [title, content] = await get_article_content(url);
      if (title && content) {
        const filename = sanitize_filename(`${title}.txt`);
        const dirPath = path.join(process.cwd(), 'public', 'articles');
        await ensureDirectoryExists(dirPath);
        const filePath = path.join(dirPath, filename);
        await fs.writeFile(filePath, content);
        results.push({ url, title, filePath });
      } else {
        throw new Error('Failed to extract content');
      }
    } catch (error) {
      console.error(`Error processing article ${url}:`, error);
      if (error instanceof Error) {
        results.push({ url, error: error.message });
      } else {
        results.push({ url, error: 'An unknown error occurred' });
      }
    }
  }
  return results;
}

export async function process_podcasts(urls: string[]) {
  const results = [];
  for (const url of urls) {
    try {
      const audioPath = await download_podcast(url);
      if (audioPath) {
        const transcription = await transcribe_podcast(audioPath);
        if (transcription) {
          const filename = sanitize_filename(`podcast_${path.basename(audioPath, '.mp3')}.txt`);
          const dirPath = path.join(process.cwd(), 'public', 'podcasts');
          await ensureDirectoryExists(dirPath);
          const filePath = path.join(dirPath, filename);
          await fs.writeFile(filePath, transcription);
          results.push({ url, filePath });
        } else {
          throw new Error('Failed to transcribe podcast');
        }
      } else {
        throw new Error('Failed to download podcast');
      }
    } catch (error) {
      console.error(`Error processing podcast ${url}:`, error);
      if (error instanceof Error) {
        results.push({ url, error: error.message });
      } else {
        results.push({ url, error: 'An unknown error occurred' });
      }
    }
  }
  return results;
}