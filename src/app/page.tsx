import ScraperForm from '../components/ScraperForm';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Web Content Scraper</h1>
        <ScraperForm />
      </div>
    </main>
  );
}