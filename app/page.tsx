'use client';
import { useState } from 'react';
import ResultCard from '@/components/ResultCard';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) return;
    setLoading(true);
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-4">YouTube SEO Heatmap Analyzer</h1>
      <input
        type="text"
        placeholder="Paste YouTube video URL"
        className="p-2 border rounded w-full max-w-md mb-4"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {result && <ResultCard result={result} />}
    </main>
  );
}
