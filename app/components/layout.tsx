import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar with Tabs */}
        <div className="w-64 bg-gray-800 min-h-screen">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">OpenBands</h1>
            <p className="text-gray-400 text-sm mt-1">Know your worth</p>
          </div>
          <nav className="mt-4 space-y-1 px-3">
            <Link 
              href="/"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                router.pathname === '/' 
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Home
            </Link>
            <Link 
              href="/projects"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                router.pathname === '/projects'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z" clipRule="evenodd" />
                <path d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z" />
              </svg>
              Projects
            </Link>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <main className="py-8 px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 