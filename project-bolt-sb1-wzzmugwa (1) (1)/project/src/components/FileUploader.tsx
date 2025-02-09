import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FolderOpen } from 'lucide-react';

interface FileUploaderProps {
  onFilesUpload: (files: File[]) => void;
}

export function FileUploader({ onFilesUpload }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesUpload(acceptedFiles);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <FolderOpen className="text-blue-500 mt-1 flex-shrink-0" size={20} />
        <div>
          <h3 className="font-medium text-blue-900">How to load your resumes:</h3>
          <p className="text-blue-700 mt-1">
            1. Open File Explorer and navigate to: <br />
            <code className="bg-blue-100 px-2 py-1 rounded text-blue-900">C:\Users\DELL\Desktop\Resumes</code>
          </p>
          <p className="text-blue-700 mt-2">
            2. Select all resume files (PDF, DOC, DOCX) from this folder
          </p>
          <p className="text-blue-700 mt-2">
            3. Drag and drop them into the area below, or click the area to select files
          </p>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4 text-gray-400" size={32} />
        <p className="text-gray-600">
          {isDragActive
            ? 'Drop the resumes here...'
            : 'Drag & drop resumes here, or click to select files'}
        </p>
        <p className="text-sm text-gray-500 mt-2">Supports PDF, DOC, and DOCX files</p>
      </div>
    </div>
  );
}