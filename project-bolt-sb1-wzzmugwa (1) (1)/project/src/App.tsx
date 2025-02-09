import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResumeList } from './components/ResumeList';
import { ResumeFile, SearchFilters, UserProfile } from './types';
import { Briefcase, Users, FileText, Code, Upload } from 'lucide-react';
import { loadLocalResumes } from './utils/fileLoader';

function App() {
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    keywords: '',
    name: '',
    ctc: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock user profile
  const userProfile: UserProfile = {
    name: "Sarah Johnson",
    role: "HR Manager",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newResumes = await loadLocalResumes(event.target.files);
      setResumes(prev => [...prev, ...newResumes]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes');
    } finally {
      setLoading(false);
      // Reset the input so the same file can be selected again
      event.target.value = '';
    }
  };

  const filteredResumes = resumes.filter(resume => {
    const content = resume.content.toLowerCase();
    const searchTerms = [
      filters.keywords.toLowerCase(),
      filters.name.toLowerCase(),
      filters.ctc.toLowerCase()
    ].filter(Boolean);

    return searchTerms.length === 0 || searchTerms.some(term => 
      content.includes(term) || 
      (resume.email?.toLowerCase().includes(term)) ||
      (resume.skills?.some(skill => skill.toLowerCase().includes(term)))
    );
  });

  const stats = {
    totalResumes: resumes.length,
    activeSearches: filteredResumes.length,
    recentUploads: resumes.slice(-5).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Code className="text-indigo-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Xeedo Technologies</h1>
                <p className="text-sm text-gray-500">Talent Acquisition Portal</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{stats.totalResumes} Candidates</p>
                  <p className="text-xs text-gray-500">in database</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{stats.activeSearches} Matching</p>
                  <p className="text-xs text-gray-500">profiles</p>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3 border-l pl-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                  <p className="text-xs text-gray-500">{userProfile.role}</p>
                </div>
                <img
                  src={userProfile.photoUrl}
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Stats Cards */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FileText className="text-indigo-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.totalResumes}</p>
                <p className="text-sm text-gray-500">Total Candidates</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.activeSearches}</p>
                <p className="text-sm text-gray-500">Matching Profiles</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4">
              <div className="p-3 bg-violet-100 rounded-lg">
                <Briefcase className="text-violet-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.recentUploads}</p>
                <p className="text-sm text-gray-500">New Profiles</p>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="col-span-12">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Load Resumes</h2>
                  <p className="text-sm text-gray-500">Select PDF files from your local folder</p>
                </div>
                <label className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
                  <Upload className="mr-2" size={20} />
                  <span>Select PDFs</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
              
              {loading && (
                <div className="text-blue-600 text-sm">Loading resumes...</div>
              )}
              
              {error && (
                <div className="text-red-600 text-sm mt-2">{error}</div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Candidate Search</h2>
                <p className="text-sm text-gray-500 mt-1">Search by name, email, skills, or expected CTC</p>
              </div>
              
              <div className="p-6">
                <SearchBar filters={filters} onFilterChange={setFilters} />
              </div>

              <div className="border-t">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
                    <span className="text-sm text-gray-500">
                      Found {filteredResumes.length} match{filteredResumes.length !== 1 ? 'es' : ''}
                    </span>
                  </div>
                  <ResumeList resumes={filteredResumes} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;