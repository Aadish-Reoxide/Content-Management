const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} = require('docx');

const generateFeedbackDoc = async (platform, feedbackList) => {
  const now = new Date().toLocaleString('en-IN');

  const children = [];

  // Title
  children.push(
    new Paragraph({
      text: `Reoxide — ${platform} Feedback Report`,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: `Generated: ${now}`,
          italics: true,
          color: '888888',
          size: 20,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: '─'.repeat(60),
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    })
  );

  // Feedback items
  feedbackList.forEach((item, index) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${index + 1}. `,
            bold: true,
            size: 22,
          }),
          new TextRun({
            text: item.user,
            bold: true,
            size: 22,
            color: '1a5276',
          }),
          new TextRun({
            text: `  •  ${item.date}`,
            size: 20,
            color: '888888',
            italics: true,
          }),
        ],
        spacing: { before: 200, after: 80 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: item.comment,
            size: 22,
          }),
        ],
        indent: { left: 360 },
        spacing: { after: 200 },
      })
    );
  });

  // Footer
  children.push(
    new Paragraph({
      text: '─'.repeat(60),
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: 'Reoxide Content Agent  •  Confidential',
          italics: true,
          color: '999999',
          size: 18,
        }),
      ],
      alignment: AlignmentType.CENTER,
    })
  );

  const doc = new Document({
    sections: [{ properties: {}, children }],
  });

  return await Packer.toBuffer(doc);
};

module.exports = { generateFeedbackDoc };