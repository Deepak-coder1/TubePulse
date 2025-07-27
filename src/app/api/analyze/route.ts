import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const dynamic = 'force-dynamic'; // Essential for Vercel

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();

    // Validate input
    if (!videoId || typeof videoId !== 'string' || videoId.length < 8) {
      return NextResponse.json(
        { error: 'Valid YouTube video ID is required (min 8 characters)' },
        { status: 400 }
      );
    }

    // Get video transcript (simulated)
    const transcript = await getVideoTranscript(videoId);
    
    // Analyze with OpenAI
    const analysis = await analyzeContent(transcript);
    
    // Calculate virality score
    const score = calculateViralityScore(analysis);

    return NextResponse.json({
      videoId,
      transcriptPreview: transcript.substring(0, 200) + (transcript.length > 200 ? '...' : ''),
      highlights: analysis.highlights,
      timestamps: analysis.timestamps,
      score,
    });
    
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed: ' + (error.message || 'Internal server error'),
        details: error.stack || ''
      },
      { status: 500 }
    );
  }
}

// Simulated transcript fetch
async function getVideoTranscript(videoId: string): Promise<string> {
  // In a real implementation, use YouTube API or a service like Youtube-transcript-api
  return `This is a simulated transcript for YouTube video ${videoId}. 
  [00:00-00:30] Introduction to the video content and what viewers can expect.
  [00:30-01:45] Main content section with key insights and demonstrations.
  [01:45-02:30] Interesting findings that surprised even the creator.
  [02:30-03:00] Conclusion and call to action for viewers to like and subscribe.
  
  In a real implementation, this would be replaced with the actual video transcript fetched
  from YouTube's API or a third-party service. The transcript length is approximately 3 minutes.`;
}

// Content analysis with OpenAI
async function analyzeContent(transcript: string): Promise<{
  highlights: string[];
  timestamps: {start: number; end: number}[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are a YouTube content analyst. Extract 3-5 engaging highlights with timestamps from video transcripts. 
          Respond ONLY with valid JSON: { "highlights": ["highlight1", ...], "timestamps": [{"start": 0, "end": 30}, ...] }`
        },
        {
          role: 'user',
          content: `Analyze this YouTube video transcript:
          
          ${transcript.substring(0, 3000)}${transcript.length > 3000 ? '... [truncated]' : ''}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    // Validate and parse response
    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No response from AI model');
    
    const parsed = JSON.parse(content);
    if (!parsed.highlights || !parsed.timestamps) {
      throw new Error('Invalid response format from AI model');
    }
    
    return {
      highlights: parsed.highlights.slice(0, 5),
      timestamps: parsed.timestamps.slice(0, 5)
    };
    
  } catch (error: any) {
    console.error('AI analysis error:', error);
    // Fallback to default analysis
    return {
      highlights: [
        'Engaging introduction that hooks viewers immediately',
        'Key demonstration at 1:30 that shows practical application',
        'Surprising reveal at 2:15 that increases shareability'
      ],
      timestamps: [
        {start: 0, end: 30},
        {start: 90, end: 110},
        {start: 135, end: 150}
      ]
    };
  }
}

// Calculate virality score
function calculateViralityScore(analysis: {
  highlights: string[];
}): number {
  // Calculate based on number of highlights and their quality
  const baseScore = Math.min(analysis.highlights.length * 15, 75);
  
  // Add quality bonus based on keyword analysis
  const qualityKeywords = ['surprising', 'secret', 'amazing', 'shocking', 'reveal'];
  const qualityBonus = analysis.highlights.reduce((bonus, highlight) => {
    return bonus + (qualityKeywords.some(kw => 
      highlight.toLowerCase().includes(kw)) ? 5 : 0);
  }, 0);
  
  // Final score with caps
  return Math.min(Math.max(baseScore + qualityBonus, 20), 95);
}
