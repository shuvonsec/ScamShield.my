import OpenAI from 'openai';

type Input = {
  url: string;
  verdict: string;
  signals: string[];
};

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateRationale(input: Input) {
  if (!client) {
    return [
      `Verdict: ${input.verdict}.`,
      `Signals: ${input.signals.slice(0, 3).join(', ') || 'None significant'}.`,
      'Recommended action: contact the organisation directly before clicking any links.'
    ];
  }

  const prompt = `You are ScamShield.my. Summarise scam risk.
URL: ${input.url}
Verdict: ${input.verdict}
Signals: ${input.signals.join(', ')}`;

  const completion = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt,
    max_output_tokens: 180
  });

  const text = completion.output_text ?? '';
  return text
    .split(/\n|\r/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5);
}
