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
              href="/submissions"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                router.pathname === '/submissions'
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd"/>
              </svg>
              Submissions
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