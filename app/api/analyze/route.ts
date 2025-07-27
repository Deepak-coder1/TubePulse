import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  // Dummy AI logic (simulate DeepSeek/OpenAI analysis)
  const result = {
    title: 'Sample YouTube Title from AI',
    tags: ['AI', 'YouTube SEO', 'Heatmap'],
    score: Math.floor(Math.random() * 100),
    suggestions: [
      'Add keywords in first 10 seconds',
      'Improve thumbnail CTR with red/green color balance',
      'Use searchable title format: How to / Best of...'
    ],
  };

  return NextResponse.json(result);
}
