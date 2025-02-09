import { ResumeFile } from '../types';
import { parseFile } from './fileParser';

export async function loadLocalResumes(files: FileList | File[]): Promise<ResumeFile[]> {
  const validFiles = Array.from(files).filter(file => {
    const extension = file.name.toLowerCase().split('.').pop();
    return extension === 'pdf';
  });

  if (validFiles.length === 0) {
    throw new Error('No PDF files found. Please select PDF files only.');
  }

  try {
    const parsedFiles = await Promise.all(validFiles.map(async (file, index) => {
      const parsedFile = await parseFile(file);
      return {
        ...parsedFile,
        id: `resume-${Date.now()}-${index}`,
        path: URL.createObjectURL(file), // Create a blob URL for the PDF
        type: 'pdf' as const
      };
    }));

    return parsedFiles;
  } catch (error) {
    console.error('Error loading resumes:', error);
    throw new Error('Failed to load some resume files. Please try again.');
  }
}