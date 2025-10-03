import OpenAI from 'openai';

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.OPENAI_BASE_URL })
  : null;

export async function generateRationale(signals: { type: string; label: string }[], verdict: string) {
  if (!client) {
    return [`Deterministic verdict: ${verdict}.`, ...signals.slice(0, 2).map((s) => s.label)];
  }

  const prompt = `Explain in short bullet points why the verdict is ${verdict}. Signals: ${signals
    .map((s) => `${s.type}: ${s.label}`)
    .join('; ')}`;
  try {
    const completion = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      max_output_tokens: 150
    });
    const text = completion.output_text ?? '';
    return text
      .split(/\n|\r/)
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 5);
  } catch (error) {
    console.error('AI rationale failed', error);
    return [`Deterministic verdict: ${verdict}.`, ...signals.slice(0, 2).map((s) => s.label)];
  }
}
