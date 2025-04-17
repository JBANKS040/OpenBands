import React, { useState, useEffect, useCallback } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { jwtDecode } from "jwt-decode";
import { OPENBANDS_CIRCUIT_HELPER } from "../lib/circuits/openbands";
import { pubkeyModulusFromJWK } from "../lib/utils";
import { supabase, Submission } from "../lib/supabase";

interface GoogleJwtPayload {
  email: string;
  kid: string;
}

interface JWK {
  kty: string;
  alg: string;
  kid: string;
  n: string;
  e: string;
  use: string;
}

interface ProofDetails {
  proof: Uint8Array;
  domain: string;
  position: string;
  salary: string;
  jwtPubKey: JsonWebKey;
  timestamp?: number;
  verificationResult?: boolean | null;
  isVerifying?: boolean;
}

async function getGooglePublicKey(kid: string): Promise<JsonWebKey> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  const jwks = await response.json();
  
  const key = jwks.keys.find((k: JWK) => k.kid === kid);
  if (!key) {
    throw new Error('Unable to find matching public key');
  }
  
  return key;
}

export default function Home() {
  const { data: session } = useSession();
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [proofGenerated, setProofGenerated] = useState(false);
  const [proofDetails, setProofDetails] = useState<ProofDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<ProofDetails[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const submissions: ProofDetails[] = data.map(item => ({
          proof: new Uint8Array(item.proof.split(',').map(Number)),
          domain: item.domain,
          position: item.position,
          salary: item.salary,
          jwtPubKey: JSON.parse(item.jwt_pub_key),
          timestamp: new Date(item.created_at).getTime()
        }));
        setRecentSubmissions(submissions);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setSalary(value);
    }
  };

  const generateProof = async () => {
    if (!session?.idToken || !position || !salary) return;

    setLoading(true);
    setError(null);
    try {
      const token = session.idToken;
      const [headerB64] = token.split('.');
      const header = JSON.parse(atob(headerB64));
      const kid = header.kid;

      const decodedToken = jwtDecode<GoogleJwtPayload>(token);
      const email = decodedToken.email;
      const domain = email.split('@')[1];

      const jwtPubkey = await getGooglePublicKey(kid);

      const generatedProof = await OPENBANDS_CIRCUIT_HELPER.generateProof({
        idToken: token,
        jwtPubkey,
        domain,
        position,
        salary,
      });

      const newProofDetails = {
        proof: generatedProof.proof,
        domain,
        position,
        salary,
        jwtPubKey: jwtPubkey,
        timestamp: Date.now(),
      };

      // Store in Supabase
      const { error: supabaseError } = await supabase
        .from('submissions')
        .insert([{
          domain,
          position,
          salary,
          proof: Array.from(generatedProof.proof).join(','),
          jwt_pub_key: JSON.stringify(jwtPubkey),
        }]);

      if (supabaseError) throw supabaseError;

      setProofDetails(newProofDetails);
      setProofGenerated(true);
      
      // Refresh submissions
      await fetchSubmissions();
      
      // Clear form
      setPosition("");
      setSalary("");
      setProofGenerated(false);
    } catch (err) {
      console.error("Error generating proof:", err);
      setError(err instanceof Error ? err.message : "Failed to generate proof");
    } finally {
      setLoading(false);
    }
  };

  const verifyProof = useCallback(async (submissionIndex: number) => {
    setRecentSubmissions(prevSubmissions => {
      const updatedSubmissions = [...prevSubmissions];
      updatedSubmissions[submissionIndex] = {
        ...updatedSubmissions[submissionIndex],
        isVerifying: true,
        verificationResult: null
      };
      return updatedSubmissions;
    });
    
    setError(null);

    try {
      const proofToVerify = recentSubmissions[submissionIndex];
      const modulus = await pubkeyModulusFromJWK(proofToVerify.jwtPubKey);
      
      const result = await OPENBANDS_CIRCUIT_HELPER.verifyProof(
        proofToVerify.proof,
        {
          domain: proofToVerify.domain,
          position: proofToVerify.position,
          salary: proofToVerify.salary,
          jwtPubKey: modulus
        }
      );

      setRecentSubmissions(prevSubmissions => {
        const updatedSubmissions = [...prevSubmissions];
        updatedSubmissions[submissionIndex] = {
          ...updatedSubmissions[submissionIndex],
          isVerifying: false,
          verificationResult: result
        };
        return updatedSubmissions;
      });
    } catch (err) {
      console.error("Error verifying proof:", err);
      setError(err instanceof Error ? err.message : "Failed to verify proof");
      
      setRecentSubmissions(prevSubmissions => {
        const updatedSubmissions = [...prevSubmissions];
        updatedSubmissions[submissionIndex] = {
          ...updatedSubmissions[submissionIndex],
          isVerifying: false,
          verificationResult: false
        };
        return updatedSubmissions;
      });
    }
  }, [recentSubmissions]);

  if (!session) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Openbands...</h2>
          <p className="text-gray-600 mb-6">
          ...where professionals share real compensation data anonymously.<br></br>
          No names, no pressure — just honest insights to help everyone make smarter career decisions.
          Join the movement for pay transparency, and help others by sharing your story.
          </p>
          <button 
            onClick={() => signIn("google")} 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Input Form */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="text-sm text-gray-500">Signed in as</div>
            <div className="text-sm font-medium text-gray-900">{session.user?.email}</div>
          </div>
          <button onClick={() => signOut()} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Sign out
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              your position at: {session.user?.email?.split('@')[1]}
            </label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              maxLength={128}
              className="form-input"
              placeholder="Enter your position"
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Salary in USD/year</label>
            <input
              type="text"
              value={salary}
              onChange={handleSalaryChange}
              maxLength={32}
              className="form-input"
              placeholder="Enter your salary in USD"
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          <button
            onClick={generateProof}
            disabled={!position || !salary || loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(!position || !salary || loading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Share Anonymously"
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Most recent submissions</h2>
        <div className="space-y-4">
          {recentSubmissions.slice(0, 5).map((submission, index) => (
            <div 
              key={`${submission.domain}-${submission.position}-${submission.timestamp}-${index}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
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
                </div>
                <button
                  onClick={() => verifyProof(index)}
                  disabled={submission.isVerifying}
                  className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${submission.isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submission.isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>

              {submission.isVerifying !== undefined && (
                <div className={`mt-2 p-2 rounded-md text-sm ${
                  submission.isVerifying 
                    ? 'bg-gray-50 text-gray-800'
                    : submission.verificationResult 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-red-50 text-red-800'
                }`}>
                  {submission.isVerifying ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </div>
                  ) : (
                    submission.verificationResult !== null
                      ? (submission.verificationResult ? "✓ Verified" : "✗ Verification failed")
                      : null
                  )}
                </div>
              )}

              <div className="mt-2 text-xs text-gray-500">
                {new Date(submission.timestamp || Date.now()).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 