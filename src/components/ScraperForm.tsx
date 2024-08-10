'use client';

import { useState } from 'react';
import axios from 'axios';
import React from 'react';

export default function ScraperForm() {
  const [resources, setResources] = useState({
    articles: '',
    podcasts: '',
    youtube_videos: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResources((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await axios.post('/api/scrape', resources);
      setResults(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        setError(`Failed to scrape content: ${errorMessage}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {['articles', 'podcasts', 'youtube_videos'].map((type) => (
        <div key={type} className="space-y-2">
          <label htmlFor={type} className="block text-sm font-medium text-gray-700 capitalize">
            {type.replace('_', ' ')}
          </label>
          <textarea
            id={type}
            name={type}
            value={resources[type as keyof typeof resources]}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder={`Enter ${type.replace('_', ' ')} URLs separated by commas`}
            rows={3}
            aria-label={`Enter ${type.replace('_', ' ')}`}
          />
        </div>
      ))}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-3 rounded-md font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
        disabled={loading}
      >
        {loading ? 'Scraping...' : 'Scrape Content'}
      </button>
      {results && (
        <div className="mt-6 space-y-4">
          {['articles', 'podcasts', 'youtube_videos'].map((type) => (
            <div key={type} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 capitalize">{type.replace('_', ' ')}</h3>
              {results[type].map((item: any, index: number) => (
                <div key={index} className="mb-2">
                  {item.error ? (
                    <p className="text-red-500">{`Error: ${item.error}`}</p>
                  ) : (
                    <p className="text-green-500">{`Successfully processed: ${item.title || item.url || item.videoId}`}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </form>
  );
}