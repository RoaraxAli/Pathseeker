// Multi-page-capable PDF generator for exporting a titled list of text
// lines (e.g. a bookmarks export). Builds valid PDF objects with correctly
// computed xref offsets — same approach as generateSamplePdf, generalized
// to paginate when the content overflows one page.
const LINES_PER_PAGE = 32;
const LINE_HEIGHT = 20;
const TOP_Y = 740;
const MARGIN_BOTTOM = 50;

// The base Helvetica font (WinAnsi/Latin-1 encoding) can't render arbitrary
// Unicode, and — more importantly — the buffer is encoded as latin1 at the
// end (see generateListPdf below), so any character outside 0-255 would
// silently corrupt the byte offsets the xref table depends on. Normalize
// common typographic characters to ASCII, then strip anything else outside
// Latin-1 rather than let it desync the file.
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

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function generateListPdf(title, lines) {
  const pagesOfLines = chunk(lines.length ? lines : ['(nothing to show)'], LINES_PER_PAGE);
  const pageCount = pagesOfLines.length;

  // Object layout: 1=Catalog, 2=Pages, then for each page: (Page, Contents)
  // pairs, then finally the shared Font object.
  const fontObjNum = 3 + pageCount * 2;
  const kids = [];
  for (let i = 0; i < pageCount; i++) kids.push(`${3 + i * 2} 0 R`);

  const objects = [];
  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pageCount} >>`;

  pagesOfLines.forEach((pageLines, i) => {
    const pageObjNum = 3 + i * 2;
    const contentsObjNum = pageObjNum + 1;

    const contentParts = [];
    let y = TOP_Y;
    if (i === 0) {
      contentParts.push(`BT /F1 18 Tf 50 ${y} Td (${escapePdfText(title)}) Tj ET`);
      y -= LINE_HEIGHT * 1.5;
    } else {
      contentParts.push(`BT /F1 12 Tf 50 ${y} Td (${escapePdfText(title)} (cont.)) Tj ET`);
      y -= LINE_HEIGHT * 1.5;
    }
    for (const line of pageLines) {
      if (y < MARGIN_BOTTOM) break; // safety net; LINES_PER_PAGE already keeps us within bounds
      contentParts.push(`BT /F1 11 Tf 50 ${y} Td (${escapePdfText(line)}) Tj ET`);
      y -= LINE_HEIGHT;
    }
    const contentStream = contentParts.join('\n');

    objects[pageObjNum] =
      `<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 ${fontObjNum} 0 R >> >> /MediaBox [0 0 612 792] /Contents ${contentsObjNum} 0 R >>`;
    objects[contentsObjNum] = `<< /Length ${Buffer.byteLength(contentStream, 'latin1')} >>\nstream\n${contentStream}\nendstream`;
  });

  objects[fontObjNum] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>`;

  const totalObjects = fontObjNum;
  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  for (let i = 1; i <= totalObjects; i++) {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = Buffer.byteLength(pdf, 'latin1');
  let xref = `xref\n0 ${totalObjects + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= totalObjects; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += xref;
  pdf += `trailer\n<< /Size ${totalObjects + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, 'latin1');
}

module.exports = generateListPdf;
