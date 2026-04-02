const axios = require('axios');
require('dotenv').config();

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b-instruct';

const callOllama = async (prompt) => {
  try {
    const res = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    });
    return res.data.response;
  } catch (err) {
    throw new Error('Ollama not running');
  }
};

const TONE_INSTRUCTIONS = {
  professional: 'Use a formal, authoritative, and polished tone. Avoid slang or casual language.',
  casual: 'Use a friendly, conversational, and relaxed tone. Write like you are talking to a friend.',
  bold: 'Use a punchy, high-energy, and provocative tone. Be direct, confident, and attention-grabbing.',
};

const generateForPlatform = async (platform, tone = 'professional') => {
  const toneInstruction = TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

  const prompts = {
    linkedin: `
You are a content writer for Reoxide, a carbon credit marketplace based in India.
Reoxide connects carbon credit buyers and sellers on a transparent, tech-driven platform.

Tone instruction: ${toneInstruction}

Write a 150-word LinkedIn post about Reoxide and the growing carbon credit market in India.

Rules:
- Follow the tone instruction strictly
- Highlight the opportunity for buyers and sellers
- End with a clear call to action to join Reoxide
- Max 3 hashtags at the end
- Output only the post text, nothing else
`,
    medium: `
You are a writer for Reoxide, a carbon credit marketplace based in India.
Reoxide connects carbon credit buyers and sellers on a transparent, tech-driven platform.

Tone instruction: ${toneInstruction}

Write a 600-word Medium article educating readers about carbon credits and how Reoxide is solving the trust and accessibility problem in the carbon market.

Rules:
- Follow the tone instruction strictly
- Start with a catchy headline
- Use subheadings to break sections
- No promotional language — educate first
- End with a thought-provoking conclusion
- Output only the article, nothing else
`,
    substack: `
You are the founder of Reoxide, a carbon credit marketplace based in India.
Reoxide connects carbon credit buyers and sellers on a transparent, tech-driven platform.

Tone instruction: ${toneInstruction}

Write a 400-word personal Substack newsletter sharing a behind-the-scenes look at why you built Reoxide and what you are learning about the carbon market.

Rules:
- Follow the tone instruction strictly
- Start with a personal observation or moment that inspired Reoxide
- Share honest lessons and insider perspective
- No formal subheadings — flowing narrative only
- Output only the newsletter text, nothing else
`,
    x: `
You are the founder of Reoxide, a carbon credit marketplace based in India.
Reoxide connects carbon credit buyers and sellers on a transparent, tech-driven platform.

Tone instruction: ${toneInstruction}

Write a 5-tweet thread on X (Twitter) about why carbon credits are the future and how Reoxide is building the infrastructure for it.

Rules:
- Follow the tone instruction strictly
- Tweet 1: Bold attention-grabbing hook
- Tweets 2-4: One sharp insight per tweet about carbon markets or Reoxide
- Tweet 5: Strong CTA — follow, invest, or join the waitlist
- Max 280 characters per tweet
- Number each tweet: 1/ 2/ 3/ 4/ 5/
- Output only the tweets, nothing else
`,
  };

  const prompt = prompts[platform.toLowerCase()];
  if (!prompt) throw new Error(`Unknown platform: ${platform}`);
  return await callOllama(prompt);
};

module.exports = { generateForPlatform };