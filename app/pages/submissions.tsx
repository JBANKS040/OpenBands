import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from "../lib/supabase";
import { OPENBANDS_CIRCUIT_HELPER } from "../lib/circuits/openbands";
import { pubkeyModulusFromJWK } from "../lib/utils";
import CompanyRatings from "../components/CompanyRatings";
import Layout from '../components/layout';
import { CompanyRatings as CompanyRatingsType } from '../lib/supabase';

// @dev - Blockchain related imports
import { connectToEvmWallet } from '../lib/smart-contracts/evm/connectToEvmWallet';
import artifactOfPositionAndSalaryProofManager from '../lib/smart-contracts/evm/smart-contracts/artifacts/PositionAndSalaryProofManager.sol/PositionAndSalaryProofManager.json';
import { storePublicInputsOfPositionAndSalaryProof, getPublicInputsOfPositionAndSalaryProof, getPublicInputsOfAllProofs } from '../lib/smart-contracts/evm/smart-contracts/positionAndSalaryProofManager';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { convertBytes32ToString } from '../lib/converters/bytes32ToStringConverter';

// @dev - Utility functions
import { bigIntToString } from "../lib/smart-contracts/evm/smart-contracts/utils/bigIntToStringConverter";

interface Submission {
  domain: string;
  position: string;
  salary: string;
  created_at: string;
  proof: string;
  jwt_pub_key: string;
  isVerifying?: boolean;
  verificationResult?: boolean | null;
  ratings?: CompanyRatingsType;
  nullifier: string;
  rsa_signature_length: number;    // 9 or 18
  //rsa_signature_length?: number; // 9 or 18
}

interface CompanyData {
  domain: string;
  submissions: Submission[];
  isExpanded?: boolean;
  averageRatings?: CompanyRatingsType;
}

const calculateAverageRatings = (submissions: Submission[]): CompanyRatingsType | undefined => {
  const submissionsWithRatings = submissions.filter(s => s.ratings);
  if (submissionsWithRatings.length === 0) return undefined;

  const initialRatings: CompanyRatingsType = {
    work_life_balance: 0,
    culture_values: 0,
    career_growth: 0,
    compensation_benefits: 0,
    leadership_quality: 0,
    operational_efficiency: 0
  };

  const summedRatings = submissionsWithRatings.reduce((acc, submission) => {
    if (!submission.ratings) return acc;
    return {
      work_life_balance: acc.work_life_balance + submission.ratings.work_life_balance,
      culture_values: acc.culture_values + submission.ratings.culture_values,
      career_growth: acc.career_growth + submission.ratings.career_growth,
      compensation_benefits: acc.compensation_benefits + submission.ratings.compensation_benefits,
      leadership_quality: acc.leadership_quality + submission.ratings.leadership_quality,
      operational_efficiency: acc.operational_efficiency + submission.ratings.operational_efficiency
    };
  }, initialRatings);

  const count = submissionsWithRatings.length;
  return {
    work_life_balance: summedRatings.work_life_balance / count,
    culture_values: summedRatings.culture_values / count,
    career_growth: summedRatings.career_growth / count,
    compensation_benefits: summedRatings.compensation_benefits / count,
    leadership_quality: summedRatings.leadership_quality / count,
    operational_efficiency: summedRatings.operational_efficiency / count
  };
};

export default function Submissions() {
  const emptyUint8Array = new Uint8Array(0);

  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionsByCompany, setSubmissionsByCompany] = useState<CompanyData[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'byCompany'>('all');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    async function init() {
      const { provider, signer } = await connectToEvmWallet(); // @dev - Connect to EVM wallet (i.e. MetaMask) on page load
      setProvider(provider);
      setSigner(signer);
      fetchSubmissions(signer);
    }
    init();
    //fetchSubmissions();
  }, []);

  const fetchSubmissions = async (signer: JsonRpcSigner) => {
  //const fetchSubmissions = async () => {
    try {
      console.log("signer (in the submission.tsx):", signer); // [Log]: "JsonRpcSigner {provider: BrowserProvider, address: '0x...'}"

      // @dev - Get the public inputs of position and salary proof from the blockchain (BASE)
      const publicInputsOfAllProofs = await getPublicInputsOfAllProofs(
        signer,
        artifactOfPositionAndSalaryProofManager.abi,
        process.env.NEXT_PUBLIC_POSITION_AND_SALARY_PROOF_MANAGER_ON_BASE_TESTNET || "",
      );
      const publicInputsOfAllProofsArray = publicInputsOfAllProofs._publicInputsOfAllProofs;
      console.log(`publicInputsOfAllProofs (in the index.tsx - already converted to string): ${JSON.stringify(publicInputsOfAllProofsArray, null, 2)}`);
      console.log(`publicInputsOfAllProofsArray.length: ${publicInputsOfAllProofsArray.length}`); // @dev - [Return]: "object"
      console.log(`typeof publicInputsOfAllProofsArray: ${typeof publicInputsOfAllProofsArray}`); // @dev - [Return]: "object"

      // @dev - Store the public inputs of position and salary proof to the "submissions" variable to be stored into the setRecentSubmissions().
      if (publicInputsOfAllProofsArray.length > 0) {
        const submissions: ProofDetails[] = publicInputsOfAllProofsArray.map((item: any) => ({
        //const submissions: ProofDetails[] = _publicInputsOfAllProofs.map((item: any) => ({
          id: "",
          created_at: item[11], 
          proof: emptyUint8Array,
          domain: item[0],
          position: item[1],
          salary: item[2],
          jwtPubKey: {} as JsonWebKey,
          timestamp: item[11],
          ratings: {
            work_life_balance: item[3],
            culture_values: item[4],
            career_growth: item[5],
            compensation_benefits: item[6],
            leadership_quality: item[7],
            operational_efficiency: item[8]
          },
          nullifier: item[9],
          rsa_signature_length: item[10] // 9 or 18
        }));
        console.log("submissions: ", submissions);
        //console.log(`submissions: ${JSON.stringify(submissions, null, 2)}`);
    
        const submissionsWithVerification = submissions;
        
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
            isExpanded: false,
            averageRatings: calculateAverageRatings(submissions)
          }));

        setSubmissionsByCompany(companiesData);
      }

      // const { data, error } = await supabase
      //   //.from('submissions')        // @dev - The "production" environment should use 'submissions' table.
      //   .from('submissions_staging')  // @dev - The "staging" environment should use 'submissions_staging' table.
      //   .select('*')
      //   .order('created_at', { ascending: false });
      
      // if (error) throw error;

      // if (data) {
      //   const submissionsWithVerification = data.map(submission => ({
      //     ...submission,
      //     isVerifying: false,
      //     verificationResult: null,
      //     ratings: submission.ratings ? JSON.parse(submission.ratings) : undefined
      //   }));
        
      //   setSubmissions(submissionsWithVerification);
        
      //   // Group by company
      //   const groupedByCompany = submissionsWithVerification.reduce((acc: { [key: string]: Submission[] }, curr) => {
      //     if (!acc[curr.domain]) {
      //       acc[curr.domain] = [];
      //     }
      //     acc[curr.domain].push(curr);
      //     return acc;
      //   }, {});

      //   const companiesData = Object.entries(groupedByCompany)
      //     .sort(([domainA], [domainB]) => domainA.localeCompare(domainB))
      //     .map(([domain, submissions]) => ({
      //       domain,
      //       submissions,
      //       isExpanded: false,
      //       averageRatings: calculateAverageRatings(submissions)
      //     }));

      //   setSubmissionsByCompany(companiesData);
      // }
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

      // @dev - [NOTE]: Somehow, since a signer, which is set in the useEffect() in this submission.tsx, is not properly stored into the global "signer" variable, the connectToEvmWallet() is needed to be called again to retrieve a "signer" value at this line. 
      const { provider, signer } = await connectToEvmWallet();

      // const proof = new Uint8Array(submission.proof.split(',').map(Number));
      // const jwtPubKey = JSON.parse(submission.jwt_pub_key);
      // const modulus = await pubkeyModulusFromJWK(jwtPubKey);
      
      const result = await OPENBANDS_CIRCUIT_HELPER.verifyProof(
        signer,
        // proof,
        // {
        //   domain: submission.domain,
        //   position: submission.position,
        //   salary: submission.salary,
        //   jwtPubKey: modulus,
        //   ratings: submission.ratings || {
        //     work_life_balance: 3,
        //     culture_values: 3,
        //     career_growth: 3,
        //     compensation_benefits: 3,
        //     leadership_quality: 3,
        //     operational_efficiency: 3
        //   }
        // },
        submission.nullifier
        // submission.rsa_signature_length
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
      <div className="text-lg font-medium text-gray-900">Someone from {submission.domain}</div>
        <div>
          <div className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Position: </span>
            {submission.position}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            <span className="font-medium">Salary: </span>
            ${submission.salary}/year
          </div>
          {submission.ratings && (
            <div className="mt-4">
              <CompanyRatings ratings={submission.ratings} />
            </div>
          )}
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
        <div className="flex items-center space-x-6">
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
          {company.averageRatings && (
            <div className="flex items-center">
              <CompanyRatings ratings={company.averageRatings} />
            </div>
          )}
        </div>
        <span className="px-3 py-1 text-sm bg-gray-100 rounded-full text-gray-600 whitespace-nowrap">
          {company.submissions.length} {company.submissions.length === 1 ? 'submission' : 'submissions'}
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
    <Layout>
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
    </Layout>
  );
} 