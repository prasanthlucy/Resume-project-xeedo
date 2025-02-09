import React from 'react';
import { FileText, Download, Calendar, ChevronDown, ChevronUp, Mail, Briefcase, Code } from 'lucide-react';
import { ResumeFile } from '../types';

interface ResumeListProps {
  resumes: ResumeFile[];
}

function highlightText(text: string, searchTerms: string[]): JSX.Element {
  if (!searchTerms.length) return <>{text}</>;

  const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = searchTerms.some(term => 
          part.toLowerCase() === term.toLowerCase()
        );
        return isMatch ? (
          <mark key={i} className="bg-yellow-200 px-1 rounded">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

function getPreviewText(content: string, searchTerms: string[]): string {
  if (!searchTerms.length) return content.slice(0, 200);

  const regex = new RegExp(`(${searchTerms.join('|')})`, 'gi');
  let match;
  let bestPreview = '';
  let maxMatches = 0;

  // Look for the section with the most keyword matches
  for (let i = 0; i < content.length - 200; i += 100) {
    const section = content.slice(i, i + 200);
    const matches = (section.match(regex) || []).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestPreview = section;
    }
  }

  return bestPreview || content.slice(0, 200);
}

export function ResumeList({ resumes }: ResumeListProps) {
  const [expandedResume, setExpandedResume] = React.useState<string | null>(null);

  if (resumes.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed">
        <FileText className="mx-auto text-gray-400 mb-3" size={32} />
        <p className="text-gray-500 font-medium">No resumes found matching your search criteria</p>
        <p className="text-sm text-gray-400 mt-1">Try adjusting your search filters</p>
      </div>
    );
  }

  // Extract all search terms from the URLs
  const urlSearchParams = new URLSearchParams(window.location.search);
  const keywords = urlSearchParams.get('keywords')?.toLowerCase().split(' ') || [];
  const name = urlSearchParams.get('name')?.toLowerCase().split(' ') || [];
  const ctc = urlSearchParams.get('ctc')?.toLowerCase().split(' ') || [];
  const allSearchTerms = [...keywords, ...name, ...ctc].filter(Boolean);

  return (
    <div className="space-y-4">
      {resumes.map((resume) => {
        const isExpanded = expandedResume === resume.id;
        const previewText = getPreviewText(resume.content, allSearchTerms);

        return (
          <div
            key={resume.id}
            className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getFileTypeColor(resume.type)}`}>
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {highlightText(resume.name, allSearchTerms)}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Mail size={14} className="mr-1" />
                        {resume.email}
                      </span>
                      <span className="flex items-center">
                        <Briefcase size={14} className="mr-1" />
                        {resume.experience}
                      </span>
                      <span className="flex items-center">
                        <Code size={14} className="mr-1" />
                        {resume.ctc}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <a
                    href={resume.path}
                    download={resume.name}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download Resume"
                  >
                    <Download size={20} />
                  </a>
                  <button
                    onClick={() => setExpandedResume(isExpanded ? null : resume.id)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title={isExpanded ? "Show less" : "Show more"}
                  >
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                </div>
              </div>
            </div>
            
            {isExpanded && (
              <div className="border-t">
                <div className="p-4 bg-gray-50">
                  <div className="prose max-w-none">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Preview</h4>
                    <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap">
                      {highlightText(previewText, allSearchTerms)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function getFileTypeColor(type: 'pdf' | 'doc' | 'docx'): string {
  switch (type) {
    case 'pdf':
      return 'bg-red-500';
    case 'doc':
    case 'docx':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
}