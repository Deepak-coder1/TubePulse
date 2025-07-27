import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();

    if (!videoId) {
      return NextResponse.json(
        { error: 'YouTube video ID is required' },
        { status: 400 }
      );
    }

    // Step 1: Get video transcript (mock - replace with actual YouTube API)
    const transcript = await getVideoTranscript(videoId);

    // Step 2: Analyze with OpenAI
    const analysis = await analyzeContent(transcript);

    // Step 3: Calculate virality score
    const score = calculateViralityScore(analysis);

    return NextResponse.json({
      videoId,
      transcriptPreview: transcript.substring(0, 100) + '...',
      highlights: analysis.highlights,
      score,
      timestamps: analysis.timestamps,
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze video' },
      { status: 500 }
    );
  }
}

// Helper Functions
async function getVideoTranscript(videoId: string): Promise<string> {
  // In production, replace with actual YouTube API call
  return `This is a mock transcript for video ${videoId}. 
  In a real implementation, you would fetch the actual transcript 
  using the YouTube API or a third-party service.`;
}

async function analyzeContent(transcript: string): Promise<{
  highlights: string[];
  timestamps: { start: number; end: number }[];
}> {
  const prompt = `
  Analyze this YouTube video transcript and:
  1. Extract 3 most engaging highlights
  2. Identify their timestamps
  3. Assess content virality factors
  
  Transcript: ${transcript.substring(0, 3000)}... [truncated if long]
  
  Respond with JSON format:
  {
    "highlights": [],
    "timestamps": [{"start": 0, "end": 0}]
  }`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: 'You are a YouTube content analyst. Provide precise highlights with timestamps.',
      },
      { role: 'user', content: prompt },
    ],
  });

  return JSON.parse(response.choices[0]?.message?.content || '{}');
}

function calculateViralityScore(analysis: {
  highlights: string[];
}): number {
  // Calculate score based on highlight quality and quantity
  const baseScore = Math.min(analysis.highlights.length * 20, 80);
  const randomnessFactor = Math.random() * 20; // Simulate variability
  return Math.min(Math.floor(baseScore + randomnessFactor), 100);
}
