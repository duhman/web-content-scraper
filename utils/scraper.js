import { get_youtube_transcription, get_video_title, sanitize_filename } from './youtube_scraper';
import { get_article_content } from './article_scraper';
import { download_podcast, transcribe_podcast } from './podcast_scraper';
import fs from 'fs/promises';
import path from 'path';

export async function process_youtube_videos(video_ids) {
  const results = {};
  for (const video_id of video_ids) {
    try {
      const youtube_transcription = await get_youtube_transcription(video_id);
      const video_title = await get_video_title(video_id);
      if (video_title) {
        const sanitized_title = sanitize_filename(video_title);
        const dir = path.join(process.cwd(), 'public', 'youtube');
        await fs.mkdir(dir, { recursive: true });
        const filename = path.join(dir, `${sanitized_title}.txt`);
        await fs.writeFile(filename, youtube_transcription);
        results[video_id] = `Transcript saved to ${filename}`;
      } else {
        results[video_id] = 'Error fetching video title';
      }
    } catch (error) {
      results[video_id] = `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  return results;
}

export async function process_articles(article_urls) {
  const results = {};
  for (const article_url of article_urls) {
    try {
      const [title, article_content] = await get_article_content(article_url);
      if (title && article_content) {
        const sanitized_title = sanitize_filename(title);
        const dir = path.join(process.cwd(), 'public', 'articles');
        await fs.mkdir(dir, { recursive: true });
        const filename = path.join(dir, `${sanitized_title}.txt`);
        await fs.writeFile(filename, article_content);
        results[article_url] = `Article content saved to ${filename}`;
      } else {
        results[article_url] = 'Error fetching article content';
      }
    } catch (error) {
      results[article_url] = `Error: ${error.message}`;
    }
  }
  return results;
}
export async function process_podcasts(podcast_urls) {
  const results = {};
  for (const podcast_url of podcast_urls) {
    const filename = await download_podcast(podcast_url);
    if (filename) {
      try {
        const podcast_transcription = await transcribe_podcast(filename);
        if (podcast_transcription) {
          const sanitized_title = sanitize_filename(path.basename(podcast_url).split('.')[0]);
          const dir = path.join(process.cwd(), 'public', 'podcasts');
          await fs.mkdir(dir, { recursive: true });
          const output_filename = path.join(dir, `${sanitized_title}.txt`);
          await fs.writeFile(output_filename, podcast_transcription);
          results[podcast_url] = `Podcast transcription saved to ${output_filename}`;
        } else {
          results[podcast_url] = 'Error transcribing podcast';
        }
      } catch (error) {
        results[podcast_url] = `Error: ${error.message}`;
      } finally {
        await fs.unlink(filename);
      }
    } else {
      results[podcast_url] = 'Error downloading podcast';
    }
  }
  return results;
}