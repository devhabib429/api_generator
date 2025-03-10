'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, apiToken, regenerateToken, signInWithGoogle, logout } = useAuth();
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToken = async () => {
    if (apiToken) {
      await navigator.clipboard.writeText(apiToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A1F]/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg">
              <Image 
                src="/api-logo.svg" 
                alt="API Generator" 
                width={28} 
                height={28} 
                className="opacity-90"
              />
            </div>
            <span className="text-lg font-medium text-white">API Generator</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-8">
              <Link 
                href="/docs" 
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Docs
              </Link>
              <Link 
                href="/examples" 
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Examples
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowToken(!showToken)}
                      className="px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 
                               border border-blue-500/20 text-sm text-blue-400"
                    >
                      {showToken ? 'Hide Token' : 'Show Token'}
                    </button>
                    {showToken && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={apiToken || ''}
                          className="px-3 py-1 bg-black/30 rounded border border-white/10 text-sm text-white/70 w-64"
                        />
                        <button
                          onClick={copyToken}
                          className="p-2 rounded-lg hover:bg-white/10"
                          title="Copy token"
                        >
                          {copied ? '✓' : '📋'}
                        </button>
                        <button
                          onClick={regenerateToken}
                          className="p-2 rounded-lg hover:bg-white/10"
                          title="Regenerate token"
                        >
                          🔄
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 
                             border border-red-500/20 text-sm text-red-400"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="px-4 py-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 
                           border border-green-500/20 text-sm text-green-400 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Sign in with Google
                </button>
              )}
            </div>

            <a 
              href="https://github.com/yourusername/api-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
} 