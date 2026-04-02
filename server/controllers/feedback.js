const { generateFeedbackDoc } = require('../services/docx');


const MOCK_FEEDBACK = {
  linkedin: [
    { user: 'Arjun Mehta', date: '2025-06-01', comment: 'Reoxide is exactly what the carbon market needed. Clean UX and transparent pricing.' },
    { user: 'Priya Nair', date: '2025-06-02', comment: 'Impressed by the marketplace concept. Would love to see API access for enterprise buyers.' },
    { user: 'Rahul Sharma', date: '2025-06-03', comment: 'Great initiative but needs more educational content for first-time carbon credit buyers.' },
    { user: 'Sneha Iyer', date: '2025-06-04', comment: 'The verification process needs more transparency. How are credits audited?' },
    { user: 'Karan Patel', date: '2025-06-05', comment: 'Solid team behind this. Looking forward to the beta launch announcement.' },
  ],
  medium: [
    { user: 'Ananya Roy', date: '2025-06-01', comment: 'Well-written article. Explains carbon credits in a way that non-experts can understand.' },
    { user: 'Vikram Das', date: '2025-06-02', comment: 'Would love a follow-up piece on how small businesses can participate in carbon markets.' },
    { user: 'Meera Krishnan', date: '2025-06-03', comment: 'The data cited is slightly outdated. Recommend updating with 2024 IPCC figures.' },
    { user: 'Arjun Singh', date: '2025-06-04', comment: 'This is the clearest explanation of voluntary carbon markets I have read.' },
    { user: 'Divya Menon', date: '2025-06-05', comment: 'Excellent piece. Shared with our sustainability team immediately.' },
  ],
  substack: [
    { user: 'Rohan Gupta', date: '2025-06-01', comment: 'Love the behind-the-scenes tone. Feels authentic and not overly polished.' },
    { user: 'Tara Bose', date: '2025-06-02', comment: 'Really appreciate the founder sharing the struggles openly. Rare in this space.' },
    { user: 'Nikhil Verma', date: '2025-06-03', comment: 'Been following since issue 1. The newsletter keeps getting better each week.' },
    { user: 'Pooja Desai', date: '2025-06-04', comment: 'Would love more numbers and milestones in future issues.' },
    { user: 'Aman Joshi', date: '2025-06-05', comment: 'The carbon market explainer in last weeks issue was a game changer for me.' },
  ],
  x: [
    { user: '@arjun_climatetech', date: '2025-06-01', comment: 'Reoxide just dropped something big. The carbon credit space will never be the same.' },
    { user: '@priya_esg', date: '2025-06-02', comment: 'Finally a platform that speaks to both buyers AND sellers. About time.' },
    { user: '@rahul_investor', date: '2025-06-03', comment: 'Been watching Reoxide for months. This thread convinced me to reach out to the team.' },
    { user: '@sneha_sustain', date: '2025-06-04', comment: 'Thread is fire but where is the product? Need a beta invite ASAP.' },
    { user: '@karan_vc', date: '2025-06-05', comment: 'Founders who build in public win. Reoxide is doing this right.' },
  ],
};

const getFeedback = (req, res) => {
  const { platform } = req.params;
  const data = MOCK_FEEDBACK[platform.toLowerCase()];

  if (!data) {
    return res.status(404).json({ error: `No feedback found for platform: ${platform}` });
  }

  return res.status(200).json({ success: true, platform, feedback: data });
};

const downloadFeedback = async (req, res) => {
  const { platform } = req.params;
  const data = MOCK_FEEDBACK[platform.toLowerCase()];

  if (!data) {
    return res.status(404).json({ error: `No feedback found for platform: ${platform}` });
  }

  try {
    const buffer = await generateFeedbackDoc(platform, data);
    const filename = `reoxide-${platform}-feedback.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getFeedback, downloadFeedback };