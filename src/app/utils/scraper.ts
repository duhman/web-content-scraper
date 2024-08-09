import { get_youtube_transcription, get_video_title, sanitize_filename } from './youtube_scraper';
import { get_article_content } from './article_scraper';
import { download_podcast, transcribe_podcast } from './podcast_scraper';
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runPythonScript(scriptPath: string, args: string[]): Promise<string> {
  const { stdout, stderr } = await execAsync(`python ${scriptPath} ${args.join(' ')}`);
  if (stderr) {
    console.error(`Python script error: ${stderr}`);
    throw new Error(stderr);
  }
  return stdout;
}

export async function process_youtube_videos(videoIds: string[]) {
  const results = [];
  for (const videoId of videoIds) {
    try {
      const transcription = await get_youtube_transcription(videoId);
      const title = await get_video_title(videoId);
      const filename = sanitize_filename(`${title || videoId}.txt`);
      const filePath = path.join(process.cwd(), 'public', 'youtube', filename);
      await fs.writeFile(filePath, transcription);
      results.push({ videoId, title, filePath });
    } catch (error) {
      console.error(`Error processing YouTube video ${videoId}:`, error);
      if (error instanceof Error) {
        results.push({ videoId, error: error.message });
      } else {
        results.push({ videoId, error: 'An unknown error occurred' });
      }
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
        const filePath = path.join(process.cwd(), 'public', 'articles', filename);
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
          const filePath = path.join(process.cwd(), 'public', 'podcasts', filename);
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