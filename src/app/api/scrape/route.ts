import { NextRequest, NextResponse } from 'next/server';
import { process_youtube_videos, process_articles, process_podcasts } from '../../utils/scraper';
import rateLimit from '../../utils/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(request: NextRequest) {
  try {
    await limiter.check(request, 10, 'CACHE_TOKEN'); // 10 requests per minute
  } catch {
    return NextResponse.json({ message: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
  }

  const { articles, podcasts, youtube_videos } = await request.json();

  if (!articles && !podcasts && !youtube_videos) {
    return NextResponse.json({ message: 'No content provided for scraping. Please enter at least one URL or video ID.' }, { status: 400 });
  }

  const articleUrls = articles ? articles.split(',').map((url: string) => url.trim()) : [];
  const podcastUrls = podcasts ? podcasts.split(',').map((url: string) => url.trim()) : [];
  const youtubeVideoIds = youtube_videos ? youtube_videos.split(',').map((id: string) => id.trim()) : [];

  try {
    const results = {
      articles: await process_articles(articleUrls),
      podcasts: await process_podcasts(podcastUrls),
      youtube_videos: await process_youtube_videos(youtubeVideoIds),
    };
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error processing content:', error);
    return NextResponse.json({ message: 'An error occurred while processing the content. Please try again.' }, { status: 500 });
  }
}