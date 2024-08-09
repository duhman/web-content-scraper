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

export async function process_youtube_videos(video_ids: string[]) {
  const results = await Promise.all(video_ids.map(async (video_id) => {
    try {
      const youtube_transcription = await get_youtube_transcription(video_id);
      const video_title = await get_video_title(video_id);
      if (video_title) {
        const sanitized_title = sanitize_filename(video_title);
        const dir = path.join(process.cwd(), 'public', 'youtube');
        await fs.mkdir(dir, { recursive: true });
        const filename = path.join(dir, `${sanitized_title}.txt`);
        await fs.writeFile(filename, youtube_transcription);
        return [video_id, `Transcript saved to ${filename}`];
      } else {
        return [video_id, 'Error fetching video title'];
      }
    } catch (error) {
      return [video_id, `Error: ${(error as Error).message}`];
    }
  }));
  return Object.fromEntries(results);
}

export async function process_articles(article_urls: string[]) {
  const results = await Promise.all(article_urls.map(async (article_url) => {
    try {
      const [title, article_content] = await runPythonScript('utils/article_scraper.py', [article_url]);
      if (title && article_content) {
        const sanitized_title = sanitize_filename(title);
        const dir = path.join(process.cwd(), 'public', 'articles');
        await fs.mkdir(dir, { recursive: true });
        const filename = path.join(dir, `${sanitized_title}.txt`);
        await fs.writeFile(filename, article_content);
        return [article_url, `Article content saved to ${filename}`];
      } else {
        return [article_url, 'Error fetching article content'];
      }
    } catch (error) {
      return [article_url, `Error: ${(error as Error).message}`];
    }
  }));
  return Object.fromEntries(results);
}

export async function process_podcasts(podcast_urls: string[]) {
  const results = await Promise.all(podcast_urls.map(async (podcast_url) => {
    try {
      const filename = await download_podcast(podcast_url);
      if (!filename) {
        return [podcast_url, 'Error downloading podcast'];
      }

      const podcast_transcription = await transcribe_podcast(filename);
      if (podcast_transcription) {
        const sanitized_title = sanitize_filename(path.basename(podcast_url, path.extname(podcast_url)));
        const dir = path.join(process.cwd(), 'public', 'podcasts');
        await fs.mkdir(dir, { recursive: true });
        const output_filename = path.join(dir, `${sanitized_title}.txt`);
        await fs.writeFile(output_filename, podcast_transcription);
        return [podcast_url, `Podcast transcription saved to ${output_filename}`];
      } else {
        return [podcast_url, 'Error transcribing podcast'];
      }
    } catch (error) {
      return [podcast_url, `Error: ${(error as Error).message}`];
    } finally {
      if (__filename) {
        await fs.unlink(__filename).catch(() => {});
      }
    }
  }));
  return Object.fromEntries(results);
}