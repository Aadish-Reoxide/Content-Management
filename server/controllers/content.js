const { generateForPlatform } = require('../services/ollama');
const axios = require('axios');
require('dotenv').config();

const generate = async (req, res) => {
  const { platform, tone, topic } = req.body;
  if (!platform) return res.status(400).json({ error: 'platform is required' });
  try {
    console.log(`Generating ${platform} | tone: ${tone || 'professional'} | topic: ${topic || 'default'}`);
    const content = await generateForPlatform(platform, tone, topic);
    return res.status(200).json({ success: true, platform, tone, topic, content });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

const editContent = async (req, res) => {
  const { platform, tone, original, instruction } = req.body;
  if (!original || !instruction) {
    return res.status(400).json({ error: 'original content and instruction are required' });
  }
  try {
    const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'qwen2.5-coder:7b-instruct';

    const prompt = `
You are an AI content editor for Reoxide, a carbon credit marketplace.
You have been given a piece of ${platform} content and an edit instruction.

Original content:
${original}

Edit instruction from the user: "${instruction}"

Rules:
- Apply the edit instruction carefully
- Keep the platform (${platform}) and tone (${tone || 'professional'}) in mind
- Keep the Reoxide brand context
- Output only the edited content, nothing else
`;

    const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
    });

    return res.status(200).json({
      success: true,
      content: response.data.response,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { generate, editContent };