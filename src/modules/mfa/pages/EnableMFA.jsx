import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { enableMFA } from "../api/mfa.api";

function parseErrors(err) {
  try {
    const data = err?.response?.data;
    if (!data) return { non_field_errors: ["Network error or no response from server"] };
    if (data.errors) return data.errors;
    if (data.detail) return { non_field_errors: [String(data.detail)] };
    if (data.message) return { non_field_errors: [String(data.message)] };
    if (typeof data === "object") {
      const out = {};
      for (const [k, v] of Object.entries(data)) {
        out[k] = Array.isArray(v) ? v.map(String) : [String(v)];
      }
      return out;
    }
    return { non_field_errors: [String(data)] };
  } catch {
    return { non_field_errors: ["Error parsing server response"] };
  }
}

export default function EnableMFA() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [qrDataUri, setQrDataUri] = useState(null);
  const [secret, setSecret] = useState(null);
  const [otpauthUrl, setOtpauthUrl] = useState(null);
  const [nonField, setNonField] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchEnable() {
      setLoading(true);
      setNonField("");
      setFieldErrors({});
      try {
        const res = await enableMFA();
        const data = res.data || {};
        if (!mounted) return;

        setSecret(data.secret || null);
        setOtpauthUrl(data.otpauth_url || data.otpauthUrl || null);

        if (data.qr) {
          setQrDataUri(data.qr);
        } else if (data.otpauth_url) {
          setQrDataUri(null);
        } else {
          setQrDataUri(null);
        }
      } catch (err) {
        const parsed = parseErrors(err);
        setFieldErrors(parsed || {});
        setNonField(parsed?.non_field_errors?.join(" | ") || "");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchEnable();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCopySecret = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopySuccess("Copied!");
      setTimeout(() => setCopySuccess(""), 2000);
    } catch {
      setCopySuccess("Could not copy");
      setTimeout(() => setCopySuccess(""), 2000);
    }
  };

  const handleOpenAuthenticator = () => {
    if (!otpauthUrl) return;
    window.open(otpauthUrl, "_blank");
  };

  const goToConfirm = () => {
    navigate("/mfa/confirm", { state: { secret } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-xl font-semibold mb-3">Enable MFA (Two-factor Authentication)</h1>
        <p className="text-sm text-gray-600 mb-4">
          Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
          or copy the secret and add it manually.
        </p>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            {nonField && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded mb-4">
                {nonField}
              </div>
            )}

            {fieldErrors && Object.keys(fieldErrors).length > 0 && (
              <div className="mb-4">
                {Object.entries(fieldErrors).map(([k, v]) => (
                  <div key={k} className="text-sm text-red-600 mb-1">
                    <strong>{k}:</strong> {Array.isArray(v) ? v.join(" | ") : String(v)}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="flex flex-col items-center">
                {qrDataUri ? (
                  <img
                    src={qrDataUri}
                    alt="MFA QR code"
                    className="w-56 h-56 object-contain border rounded p-2 bg-white"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center border rounded text-sm text-gray-500">
                    QR not available
                  </div>
                )}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleOpenAuthenticator}
                    disabled={!otpauthUrl}
                    className={`px-3 py-2 rounded border text-sm ${otpauthUrl ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                  >
                    Open in Authenticator
                  </button>

                  <button
                    onClick={() => {
                      if (!qrDataUri) return;
                      const link = document.createElement("a");
                      link.href = qrDataUri;
                      link.download = "mfa-qr.png";
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className={`px-3 py-2 rounded border text-sm ${qrDataUri ? "bg-white hover:bg-gray-50" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                    disabled={!qrDataUri}
                  >
                    {qrDataUri ? "Download QR" : "No QR"}
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Secret</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={secret || ""}
                      className="w-full px-3 py-2 border rounded bg-gray-50"
                    />
                    <button
                      onClick={handleCopySecret}
                      className="px-3 py-2 rounded bg-indigo-600 text-white text-sm hover:bg-indigo-700"
                      disabled={!secret}
                    >
                      Copy
                    </button>
                  </div>
                  {copySuccess && <p className="text-sm text-green-600 mt-2">{copySuccess}</p>}
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Manual setup</label>
                  <p className="text-sm text-gray-600">
                    If your authenticator app requires manual setup, copy the secret and add an account.
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={goToConfirm}
                    disabled={!secret}
                    className={`px-4 py-2 rounded ${secret ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-100 text-gray-500 cursor-not-allowed"}`}
                  >
                    Continue to confirm
                  </button>

                  <a
                    href="/vendor"
                    className="px-4 py-2 rounded border text-sm bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </a>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                  After clicking <strong>Continue to confirm</strong>, you will be asked to enter a TOTP code
                  from your app to finalize enabling MFA.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
