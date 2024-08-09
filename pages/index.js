import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [resources, setResources] = useState({
    articles: '',
    podcasts: '',
    youtube_videos: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResources((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    if (!urlPattern.test(resources.articles) || !urlPattern.test(resources.podcasts) || !urlPattern.test(resources.youtube_videos)) {
      setError('Please enter valid URLs.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/scrape', resources);
      console.log(response.data);
    } catch (error) {
      setError('Failed to scrape content. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Web Content Scraper</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Articles</label>
            <textarea
              name="articles"
              value={resources.articles}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter article URLs separated by commas"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Podcasts</label>
            <textarea
              name="podcasts"
              value={resources.podcasts}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter podcast URLs separated by commas"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">YouTube Videos</label>
            <textarea
              name="youtube_videos"
              value={resources.youtube_videos}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter YouTube video IDs separated by commas"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
            disabled={loading}
          >
            {loading ? 'Scraping...' : 'Scrape Content'}
          </button>
        </form>
      </div>
    </div>
  );
}