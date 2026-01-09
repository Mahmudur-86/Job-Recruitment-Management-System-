import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ViewRecruitmentLetter() {
  const token = useMemo(() => localStorage.getItem("token"), []);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [letter, setLetter] = useState(null);

  const [toast, setToast] = useState({ show: false, text: "", type: "success" });
  const toastTimerRef = useRef(null);

  const showToast = (text, type = "success") => {
    setToast({ show: true, text, type });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(
      () => setToast({ show: false, text: "", type: "success" }),
      2000
    );
  };

  const [dlUI, setDlUI] = useState({ open: false, stage: "idle" });
  const closeDlUI = () => setDlUI({ open: false, stage: "idle" });

  const letterContainerRef = useRef(null);

  
  // Load latest published letter
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        if (!token) {
          setErr("JobSeeker token missing. Please login again.");
          setLetter(null);
          return;
        }

        const res = await axios.get(
          `${API_BASE}/api/recruitment-letters/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setLetter(res.data || null);
      } catch (e) {
        console.error(e);
        setErr(e?.response?.data?.message || "Failed to load letter.");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, [token]);

  {/*const issueDatePretty = useMemo(
    () => prettyDate(letter?.issueDate),
    [letter?.issueDate]
  ); */}


const issueDatePretty = letter?.issueDate || "";


 
  //  PDF DOWNLOAD
  
  const handleDownloadClick = async () => {
    if (!letter || loading) return;

    if (!token) {
      showToast("Token missing", "warn");
      return;
    }

    try {
      setDlUI({ open: true, stage: "downloading" });

      const res = await axios.get(
        `${API_BASE}/api/recruitment-letters/${letter._id}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      const safeName = (letter.candidateName || "JobSeeker").replace(/\s+/g, "_");
      a.download = `Recruitment_Letter_${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      setDlUI({ open: true, stage: "done" });
      showToast("PDF downloaded successfully", "success");

      setTimeout(() => {
        setDlUI((p) => (p.open ? { open: false, stage: "idle" } : p));
      }, 1400);
    } catch (e) {
      console.error(e);
      setDlUI({ open: false, stage: "idle" });
      showToast(e?.response?.data?.message || "PDF download failed", "warn");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast.show && (
        <div className="fixed right-4 top-4 z-50">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
            <div className="text-xs text-slate-700">{toast.text}</div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {dlUI.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold text-slate-900">
                  Download PDF
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  {dlUI.stage === "downloading"
                    ? "Downloading..."
                    : dlUI.stage === "done"
                    ? "PDF downloaded successfully "
                    : ""}
                </div>
              </div>
              <button
                onClick={closeDlUI}
                className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              {dlUI.stage === "downloading" ? (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
                  <div className="text-sm text-slate-700">Please wait…</div>
                </div>
              ) : (
                <div className="text-sm font-semibold text-slate-900">
                  PDF Downloaded
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={closeDlUI}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Recruitment Letter
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              View your official offer letter. Download PDF and sign in the blank
              box.
            </p>
          </div>

          <button
            onClick={handleDownloadClick}
            disabled={!letter || loading}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            Download PDF
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-52 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-80 w-full rounded bg-slate-100" />
            </div>
          ) : err ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              {err}
            </div>
          ) : !letter ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              No recruitment letter found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-300 bg-white">
              <div className="p-6 sm:p-10" ref={letterContainerRef}>
                <LetterTemplate
                  data={letter}
                  issueDatePretty={issueDatePretty}
                />

                <div className="mt-8 flex justify-end">
                  <div className="w-[260px]">
                    <div className="h-10 border-b-2 border-slate-900" />
                    <div className="mt-1 text-center text-xs text-slate-900">
                      Signature
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- TEMPLATE ---------------- */

function LetterTemplate({ data, issueDatePretty }) {
  const line = (v) => (v && String(v).trim() ? String(v).trim() : "");
  const has = (v) => Boolean(line(v));
  const subject = has(data.subject) ? data.subject : "Recruitment Letter";

  return (
    <div className="text-slate-900">
      <div className="border-b border-slate-200 pb-4">
        <div className="text-xl font-extrabold">{data.companyName}</div>
        {has(data.companyAddress) && (
          <div className="mt-1 whitespace-pre-line text-sm text-slate-700">
            {data.companyAddress}
          </div>
        )}
        {(has(data.companyPhone) || has(data.companyEmail)) && (
          <div className="mt-1 text-sm text-slate-700">
            {data.companyPhone}
            {data.companyPhone && data.companyEmail && " • "}
            {data.companyEmail}
          </div>
        )}
        <div className="mt-3 text-sm text-slate-700">
          <div>
            <span className="font-semibold">Ref:</span> {data.letterRefNo}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {issueDatePretty}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-lg font-extrabold uppercase">
        Recruitment Letter
      </div>

      <div className="mt-6 text-sm leading-6">
        <div className="font-bold">To,</div>
        <div className="font-semibold">{data.candidateName}</div>
        {has(data.candidateAddress) && (
          <div className="whitespace-pre-line text-slate-700">
            {data.candidateAddress}
          </div>
        )}
        {has(data.candidateEmail) && (
          <div className="text-slate-700">{data.candidateEmail}</div>
        )}
      </div>

      <div className="mt-4 text-sm">
        <span className="font-bold">Subject:</span>{" "}
        <span className="font-semibold">{subject}</span>
      </div>

      <div className="mt-5 space-y-4 text-sm leading-6">
        <p>
          Dear <b>{data.candidateName}</b>,
        </p>
        <p>
          We are pleased to offer you the position of{" "}
          <b>{data.positionTitle}</b>{" "}
          {has(data.department) && <>in the <b>{data.department}</b></>} at{" "}
          <b>{data.companyName}</b>.
        </p>

        <ul className="list-disc pl-5">
          {has(data.startDate) && <li>Start Date: {prettyDate(data.startDate)}</li>}
          {has(data.salaryAmount) && (
            <li>
              Salary: {data.salaryAmount} ({data.salaryFrequency})
            </li>
          )}
          {has(data.probationPeriod) && <li>Probation Period: {data.probationPeriod}</li>}
          {has(data.workingHours) && <li>Working Hours: {data.workingHours}</li>}
         
          
         
          
          {has(data.reportingTo) && <li>Reporting To: {data.reportingTo}</li>}
           {has(data.officeAddress) && <li>Office Address: {data.officeAddress}</li>}
        </ul>

        {has(data.extraTerms) && <p>{data.extraTerms}</p>}

        <p>We look forward to welcoming you to our team.</p>
      </div>

      <div className="mt-10 text-sm">
        <div className="font-semibold">Sincerely,</div>
        <div className="mt-4 font-bold">{data.hrName}</div>
        <div>{data.hrTitle}</div>
        <div>{data.companyName}</div>
      </div>
    </div>
  );
}

function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
