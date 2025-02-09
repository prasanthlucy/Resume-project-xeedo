import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';
import { ResumeFile } from '../types';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

async function parsePdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => 'str' in item ? item.str : '').join(' ') + '\n';
  }
  
  return text;
}

export async function parseFile(file: File): Promise<ResumeFile> {
  const fileType = file.name.toLowerCase().split('.').pop();
  const arrayBuffer = await file.arrayBuffer();

  let content = '';

  if (fileType === 'pdf') {
    content = await parsePdf(arrayBuffer);
  } else if (fileType === 'doc' || fileType === 'docx') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    content = result.value;
  }

  return {
    name: file.name,
    path: URL.createObjectURL(file),
    content: content.toLowerCase(),
    type: fileType as 'pdf' | 'doc' | 'docx'
  };
}