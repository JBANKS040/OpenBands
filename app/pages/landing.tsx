import React, { useState } from 'react';
import Link from 'next/link';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement waitlist functionality
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/Openbands.png" alt="Openbands Logo" className="w-8 h-8" />
          <div className="text-xl font-bold">Openbands</div>
        </div>
        <div className="flex gap-6">
          <a href="https://x.com/OpenbandsXYZ" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Share salary data
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            privately & safely.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          The first privacy-preserving company review platform. Share salary information and rate companies without revealing your identity.
        </p>
        <div className="flex justify-center">
          <button 
            onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            Join Waitlist
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H8m4-9V6m0 0V4m0 2h2m-2 0H8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Zero-Knowledge Proofs</h3>
              <p className="text-gray-600">
                Prove you work at a company without revealing your identity. Mathematical guarantees of privacy.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Verified Submissions</h3>
              <p className="text-gray-600">
                All salary reports and reviews are cryptographically verified from legitimate company employees.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">No Retaliation</h3>
              <p className="text-gray-600">
                Share honest feedback without fear. Your identity remains completely anonymous and untraceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            As easy as sending an email.
          </h2>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Sign in with Google</h3>
                <p className="text-gray-600 text-lg">
                  Use your work Google account to authenticate. We verify your company domain without storing personal data.
                </p>
              </div>
              <div className="md:w-1/2 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm font-mono text-green-600">
                  ✓ Verifying @company.com domain<br/>
                  ✓ Generating proof of employment<br/>
                  ✓ Maintaining anonymity
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Upload Salary Information</h3>
                <p className="text-gray-600 text-lg">
                  Share an email, PDF or bank statement containing your salary info. Our zero-knowledge circuits extract data without revealing personal and sensitive information.
                </p>
              </div>
              <div className="md:w-1/2 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-500">Drop your file here</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Submit Anonymously</h3>
                <p className="text-gray-600 text-lg">
                  Rate your company and submit a review. Your submission is cryptographically verified but completely anonymous.
                </p>
              </div>
              <div className="md:w-1/2 bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Work-Life Balance</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-4 h-4 rounded-full ${i <= 4 ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Compensation</span>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`w-4 h-4 rounded-full ${i <= 3 ? 'bg-yellow-400' : 'bg-gray-300'}`}></div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-600">✓ Proof verified • Anonymous submission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            The only platform with both high anonymity and verification.
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Stop worrying about retaliation. Share honest feedback with mathematical privacy guarantees.
          </p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <img src="/competition.jpg" alt="Competition Matrix - Openbands positioned with high anonymity and verification" className="w-full h-auto rounded-lg" />
            <div className="mt-6 text-center text-sm text-gray-500">
              Platform positioning based on anonymity guarantees and verification strength
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "What is Openbands?",
                a: "Openbands is a privacy-preserving company review platform that uses zero-knowledge proofs to verify employee submissions while maintaining complete anonymity."
              },
              {
                q: "How does zero-knowledge proof work?",
                a: "Zero-knowledge proofs allow you to prove you work at a company without revealing your identity. We verify your work email and extract salary data from emails without exposing the full content."
              },
              {
                q: "Is my data really private?",
                a: "Yes. We use cryptographic proofs that mathematically guarantee your privacy. Your identity cannot be traced back to your submissions, even by us."
              },
              {
                q: "What companies can I review?",
                a: "Any company with Google Workspace email domains. We verify your employment through your work email address without storing personal information."
              },
              {
                q: "How do you verify salary information?",
                a: "You upload files like emails, PDFs or bank statements containing salary information. Our zero-knowledge circuits extract the relevant data while keeping your personal and sensitive information private."
              },
              {
                q: "Can my employer identify my review?",
                a: "No. The cryptographic proofs ensure that submissions cannot be linked back to specific individuals, providing mathematical guarantees of anonymity."
              }
            ].map((faq, index) => (
              <details key={index} className="group border border-gray-200 rounded-lg bg-white shadow-sm">
                <summary className="p-6 cursor-pointer font-semibold text-lg hover:bg-gray-50 transition-colors">
                  {faq.q}
                </summary>
                <div className="px-6 pb-6 text-gray-600">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Technology & Achievement Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-purple-800">🏆 1st Place Winner</h2>
              <p className="text-xl text-purple-700">
                Noirhack 2025
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-16">
              <img src="/aztec_logo-251b1f522e334e19ddc522852ffdf921.png" alt="Aztec Logo" className="h-16" />
              <img src="/logoDark.png" alt="Noir Logo" className="h-16" />
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't miss out – early access with special perks.
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sign up for our waitlist for exclusive rewards and early access to new features.
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          ) : (
            <div className="max-w-md mx-auto p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-600 text-lg font-semibold mb-2">Thanks for joining!</div>
              <p className="text-green-600">We'll notify you when early access is available.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <img src="/Openbands.png" alt="Openbands Logo" className="w-6 h-6" />
                <div className="text-xl font-bold">Openbands</div>
              </div>
              <p className="text-gray-600 max-w-md">
                Openbands makes company reviews truly anonymous and verifiable. Built with zero-knowledge proofs, 
                it gives you full privacy - no retaliation, no tracking.
              </p>
            </div>
            <div className="flex gap-6">
              <a href="https://x.com/OpenbandsXYZ" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-500">
            © 2025 Openbands. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;