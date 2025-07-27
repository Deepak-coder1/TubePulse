import React from 'react';

export default function ResultCard({ result }: { result: any }) {
  return (
    <div className="mt-6 p-4 border rounded shadow bg-white max-w-lg">
      <h2 className="text-xl font-semibold">Result</h2>
      <p><strong>Title:</strong> {result.title}</p>
      <p><strong>SEO Score:</strong> {result.score}%</p>
      <p><strong>Tags:</strong> {result.tags.join(', ')}</p>
      <h3 className="mt-2 font-bold">Suggestions:</h3>
      <ul className="list-disc ml-5">
        {result.suggestions.map((s: string, i: number) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
