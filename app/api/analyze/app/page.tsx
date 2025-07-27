'use client';
import { useState } from 'react';

export default function Home() {
  const [videoId, setVideoId] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeVideo = async () => {
    if (!videoId) {
      setError('Please enter a YouTube video ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError('Failed to analyze video');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">YouTube Virality Analyzer</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="Enter YouTube Video ID"
              className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={analyzeVideo}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>

        {analysis && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <h3 className="font-medium text-blue-800">Virality Score</h3>
                  <div className="text-4xl font-bold text-blue-600 my-2">
                    {analysis.score}/100
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${analysis.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
              <ul className="space-y-3">
                {analysis.highlights.map((highlight: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-medium mr-3">
                      {i + 1}
                    </span>
                    <p>{highlight}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Heatmap Preview</h3>
              <div className="h-64 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-md flex items-center justify-center text-gray-500">
                [Heatmap Visualization Would Appear Here]
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
