// Builds a minimal, spec-valid single-page PDF (title + bullet lines) as a
// Buffer, with a correctly-computed xref table — not just objects thrown
// together and hoped to be lenient-viewer-compatible.
// Non-Latin1 characters would corrupt the byte-accurate xref offsets below
// (the buffer is encoded as latin1) — normalize common typographic
// characters to ASCII and strip anything else outside Latin-1.
function sanitizeForLatin1(str) {
  return String(str)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x00-\xff]/g, '?');
}

function escapePdfText(str) {
  return sanitizeForLatin1(str).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function generateSamplePdf(title, lines) {
  const contentLines = [`BT /F1 18 Tf 50 740 Td (${escapePdfText(title)}) Tj ET`];
  let y = 700;
  for (const line of lines) {
    contentLines.push(`BT /F1 12 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`);
    y -= 22;
  }
  const contentStream = contentLines.join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    `<< /Length ${Buffer.byteLength(contentStream, 'latin1')} >>\nstream\n${contentStream}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0]; // offsets[0] unused (object 0 is the free-list head)

  objects.forEach((body, i) => {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, 'latin1');
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, 'latin1');
}

module.exports = generateSamplePdf;
