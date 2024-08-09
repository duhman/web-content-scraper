import { process_youtube_videos, process_articles, process_podcasts } from '../../utils/scraper';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { articles, podcasts, youtube_videos } = req.body;

    const articleUrls = articles.split(',').map((url) => url.trim());
    const podcastUrls = podcasts.split(',').map((url) => url.trim());
    const youtubeVideoIds = youtube_videos.split(',').map((id) => id.trim());

    const results = {};
    results.articles = await process_articles(articleUrls);
    results.podcasts = await process_podcasts(podcastUrls);
    results.youtube_videos = await process_youtube_videos(youtubeVideoIds);

    res.status(200).json(results);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}