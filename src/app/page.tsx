'use client';
import { useState } from 'react';

export default function YouTubeAnalyzer() {
  const [videoId, setVideoId] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeVideo = async () => {
    if (!videoId.trim()) {
      setError('Please enter a valid YouTube video ID');
      return;
    }
    
    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze video');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            YouTube Virality Analyzer
          </h1>
          <p className="text-gray-600">
            Analyze YouTube videos for engagement potential and key highlights
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="Enter YouTube Video ID"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={analyzeVideo}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : 'Analyze Video'}
            </button>
          </div>
          {error && <p className="mt-3 text-red-500 bg-red-50 p-2 rounded-md">{error}</p>}
          <p className="mt-3 text-sm text-gray-500">
            Example video ID: <span className="font-mono">dQw4w9WgXcQ</span>
          </p>
        </div>

        {analysis && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl flex-1">
                  <h3 className="font-medium text-blue-800 mb-2">Virality Score</h3>
                  <div className="flex items-baseline gap-3">
                    <div className="text-5xl font-bold text-blue-600">{analysis.score}</div>
                    <div className="text-gray-500">/100</div>
                  </div>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                      style={{ width: `${analysis.score}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl flex-1">
                  <h3 className="font-medium text-purple-800 mb-2">Engagement Level</h3>
                  <div className="text-3xl font-bold text-purple-600">
                    {analysis.score > 80 ? 'Excellent' : 
                     analysis.score > 60 ? 'Good' : 
                     analysis.score > 40 ? 'Average' : 'Low'}
                  </div>
                  <p className="mt-2 text-purple-700">
                    {analysis.score > 80 ? 'High viral potential' : 
                     analysis.score > 60 ? 'Good engagement opportunities' : 
                     analysis.score > 40 ? 'Moderate viral chance' : 'Needs improvement'}
                  </p>
                </div>
              </div>

              {/* Highlights */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Key Highlights</h3>
                <ul className="space-y-3">
                  {analysis.highlights.map((highlight: string, i: number) => (
                    <li key={i} className="flex items-start bg-gray-50 p-4 rounded-lg">
                      <span className="flex-shrink-0 bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-medium mr-3">
                        {i + 1}
                      </span>
                      <p className="text-gray-700">{highlight}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Heatmap Preview */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Engagement Heatmap</h3>
              <div className="h-64 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="inline-block p-4 bg-white rounded-lg shadow mb-4">
                    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 w-16 h-2 rounded-full mb-2"></div>
                    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 w-24 h-2 rounded-full mb-2"></div>
                    <div className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 w-20 h-2 rounded-full"></div>
                  </div>
                  <p className="text-gray-500 max-w-md">
                    Visual heatmap showing engagement spikes throughout the video would appear here.
                    Timestamps: {analysis.timestamps.map((ts: any) => `${ts.start}s`).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Raw Data */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-3">Technical Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{JSON.stringify(analysis, null, 2)}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p>Deployed securely on Vercel • OpenAI-powered analysis</p>
      </footer>
    </div>
  );
}
