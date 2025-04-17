import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from "next-auth/react";
import { supabase } from "../lib/supabase";
import { OPENBANDS_CIRCUIT_HELPER } from "../lib/circuits/openbands";
import { pubkeyModulusFromJWK } from "../lib/utils";

interface Submission {
  domain: string;
  position: string;
  salary: string;
  created_at: string;
  proof: string;
  jwt_pub_key: string;
  isVerifying?: boolean;
  verificationResult?: boolean | null;
}

interface CompanyData {
  domain: string;
  submissions: Submission[];
  isExpanded?: boolean;
}

export default function Submissions() {
  const { data: session } = useSession();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsByCompany, setSubmissionsByCompany] = useState<CompanyData[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'byCompany'>('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('domain, position, salary, created_at, proof, jwt_pub_key')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const submissionsWithVerification = data.map(submission => ({
          ...submission,
          isVerifying: false,
          verificationResult: null
        }));
        
        setSubmissions(submissionsWithVerification);
        
        // Group by company
        const groupedByCompany = submissionsWithVerification.reduce((acc: { [key: string]: Submission[] }, curr) => {
          if (!acc[curr.domain]) {
            acc[curr.domain] = [];
          }
          acc[curr.domain].push(curr);
          return acc;
        }, {});

        const companiesData = Object.entries(groupedByCompany)
          .sort(([domainA], [domainB]) => domainA.localeCompare(domainB))
          .map(([domain, submissions]) => ({
            domain,
            submissions,
            isExpanded: false
          }));

        setSubmissionsByCompany(companiesData);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const verifySubmission = useCallback(async (submission: Submission, submissionIndex: number, companyIndex?: number) => {
    const updateSubmissionState = (
      isVerifying: boolean,
      verificationResult: boolean | null,
      targetSubmission: Submission
    ) => {
      if (viewMode === 'all') {
        setSubmissions(prev => {
          const updated = [...prev];
          updated[submissionIndex] = {
            ...targetSubmission,
            isVerifying,
            verificationResult
          };
          return updated;
        });
      } else {
        setSubmissionsByCompany(prev => {
          const updated = [...prev];
          if (companyIndex !== undefined) {
            const companySubmissions = [...updated[companyIndex].submissions];
            const subIndex = companySubmissions.findIndex(
              s => s.created_at === targetSubmission.created_at && s.domain === targetSubmission.domain
            );
            if (subIndex !== -1) {
              companySubmissions[subIndex] = {
                ...targetSubmission,
                isVerifying,
                verificationResult
              };
              updated[companyIndex] = {
                ...updated[companyIndex],
                submissions: companySubmissions
              };
            }
          }
          return updated;
        });
      }
    };

    try {
      updateSubmissionState(true, null, submission);

      const proof = new Uint8Array(submission.proof.split(',').map(Number));
      const jwtPubKey = JSON.parse(submission.jwt_pub_key);
      const modulus = await pubkeyModulusFromJWK(jwtPubKey);
      
      const result = await OPENBANDS_CIRCUIT_HELPER.verifyProof(
        proof,
        {
          domain: submission.domain,
          position: submission.position,
          salary: submission.salary,
          jwtPubKey: modulus
        }
      );

      updateSubmissionState(false, result, submission);
    } catch (err) {
      console.error("Error verifying proof:", err);
      updateSubmissionState(false, false, submission);
    }
  }, [viewMode]);

  const toggleCompany = (index: number) => {
    setSubmissionsByCompany(prevSubmissionsByCompany => {
      const newSubmissionsByCompany = [...prevSubmissionsByCompany];
      newSubmissionsByCompany[index] = {
        ...newSubmissionsByCompany[index],
        isExpanded: !newSubmissionsByCompany[index].isExpanded
      };
      return newSubmissionsByCompany;
    });
  };

  const renderSubmission = (submission: Submission, index: number, companyIndex?: number) => (
    <div 
      key={`${submission.domain}-${submission.position}-${submission.created_at}`}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-lg font-medium text-gray-900">Someone from {submission.domain}</div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Position: </span>
            {submission.position}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            <span className="font-medium">Salary: </span>
            ${submission.salary}/year
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {new Date(submission.created_at).toLocaleString()}
          </div>
        </div>
        <button
          onClick={() => verifySubmission(submission, index, companyIndex)}
          disabled={submission.isVerifying}
          className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            submission.isVerifying ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {submission.isVerifying ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verifying...
            </span>
          ) : 'Verify'}
        </button>
      </div>

      {submission.isVerifying !== undefined && submission.verificationResult !== null && (
        <div className={`mt-4 p-2 rounded-md text-sm ${
          submission.verificationResult 
            ? 'bg-green-50 text-green-800' 
            : 'bg-red-50 text-red-800'
        }`}>
          {submission.verificationResult ? "✓ Verified" : "✗ Verification failed"}
        </div>
      )}
    </div>
  );

  const renderCompany = (company: CompanyData, index: number) => (
    <div 
      key={company.domain}
      className="bg-white rounded-lg shadow-sm transition-shadow"
    >
      <button
        onClick={() => toggleCompany(index)}
        className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <div className="flex items-center space-x-3">
          <svg 
            className={`h-5 w-5 text-gray-500 transform transition-transform ${company.isExpanded ? 'rotate-90' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900">{company.domain}</h3>
        </div>
        <span className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-600">
          {company.submissions.length} submissions
        </span>
      </button>
      
      {company.isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t">
          {company.submissions.map((submission, subIndex) => 
            renderSubmission(submission, subIndex, index)
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Show All
          </button>
          <button
            onClick={() => setViewMode('byCompany')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              viewMode === 'byCompany'
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Group by Company
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {viewMode === 'all' ? (
          submissions.map((submission, index) => renderSubmission(submission, index))
        ) : (
          submissionsByCompany.map((company, index) => renderCompany(company, index))
        )}
      </div>
    </div>
  );
} 