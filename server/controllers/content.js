const { generateForPlatform } = require('../services/ollama');

const generate = async (req, res) => {
  const { platform, tone } = req.body;

  if (!platform) {
    return res.status(400).json({ error: 'platform is required' });
  }

  try {
    console.log(`Generating ${platform} content with tone: ${tone || 'professional'}`);
    const content = await generateForPlatform(platform, tone);
    return res.status(200).json({ success: true, platform, tone, content });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { generate };