'use client';

import { API_BASE_URL } from '@/app/utils/config';
import { useState } from 'react';

export default function YouTubeUsernameGenerator() {
  
  const [fullName, setFullName] = useState('');
  const [accountTopic, setAccountTopic] = useState('');
  const [description, setDescription] = useState('');
  const [usernames, setUsernames] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setShowResult(false);
    setShowError(false);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/youtube/username-generator`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          topic: accountTopic,
          description: description,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message);
        setShowError(true);
      } else {
        if (Array.isArray(data.data)) {
          setUsernames(data.data);
        } else {
          setUsernames([data.data || "No username generated."]);
        }
        setShowResult(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while generating the username. Please try again.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="w-full max-w-3xl">
        <div className="space-y-6 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm">
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-[#00f2ea]/10 rounded-2xl">
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  style={{ filter: "drop-shadow(0 0 8px rgba(0, 211, 243, 0.4))" }}
                  className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                >
                  <path
                    fill="#00d3f3"
                    d="M14.712 4.633a1.754 1.754 0 00-1.234-1.234C12.382 3.11 8 3.11 8 3.11s-4.382 0-5.478.289c-.6.161-1.072.634-1.234 1.234C1 5.728 1 8 1 8s0 2.283.288 3.367c.162.6.635 1.073 1.234 1.234C3.618 12.89 8 12.89 8 12.89s4.382 0 5.478-.289a1.754 1.754 0 001.234-1.234C15 10.272 15 8 15 8s0-2.272-.288-3.367z"
                  />
                  <path
                    fill="white"
                    d="M6.593 10.11l3.644-2.098-3.644-2.11v4.208z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-[24px] md:text-[28px] lg:text-[32px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              YouTube Username Generator
            </h1>
            <p className="text-slate-400 text-xs md:text-sm lg:text-base max-w-xl mx-auto">
              Create unique and memorable YouTube usernames
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="fullname"
                  className="flex items-center gap-2 text-gray-200 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Full Name
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="accountTopic"
                  className="flex items-center gap-2 text-gray-200 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  Account Topic
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="accountTopic"
                    name="accountTopic"
                    value={accountTopic}
                    onChange={(e) => setAccountTopic(e.target.value)}
                    placeholder="e.g., Gaming, Travel, Tech Reviews"
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-gray-200 font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h7"
                    />
                  </svg>
                  Account Description
                </label>

                <div className="relative">
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your channel..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-white placeholder-gray-500 border border-gray-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Generate Username
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {showResult && (
          <div className="mt-8 p-6 bg-gradient-to-b from-sky-950/50 to-slate-900/50 rounded-xl border border-sky-400/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-cyan-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Generated Usernames
              </h2>
            </div>
            <div className="text-gray-300 leading-relaxed space-y-2">
              {usernames.length > 0 && (
                <ol className="list-decimal pl-5">
                  {usernames.map((username, index) => (
                    <li key={index}>{username}</li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && (
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500/50 rounded-xl">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Error</span>
            </div>
            <p className="text-red-300" dangerouslySetInnerHTML={{ __html: error }}></p>
          </div>
        )}
      </div>
      <style jsx global>{`
        li::marker {
          color: rgb(0, 211, 243);
        }
      `}</style>
    </div>
  );
}

