export interface ResumeFile {
  id: string;
  name: string;
  path: string;
  content: string;
  type: 'pdf' | 'doc' | 'docx';
  preview?: string;
  email?: string;
  experience?: string;
  ctc?: string;
  skills?: string[];
}

export interface SearchFilters {
  keywords: string;
  name: string;
  ctc: string;
}

export interface UserProfile {
  name: string;
  role: string;
  photoUrl: string;
}