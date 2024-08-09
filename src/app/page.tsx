import ScraperForm from '../components/ScraperForm';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Web Content Scraper</h1>
        <ScraperForm />
      </div>
    </main>
  );
}