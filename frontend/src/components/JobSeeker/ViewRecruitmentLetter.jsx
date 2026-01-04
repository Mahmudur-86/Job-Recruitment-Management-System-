// ViewRecruitmentLetter.jsx (JOBSEEKER)


import React, { useEffect, useMemo, useRef, useState } from "react";

export default function ViewRecruitmentLetter() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [letter, setLetter] = useState(null);

  //  toast (no alert)
  const [toast, setToast] = useState({ show: false, text: "" });
  const toastTimerRef = useRef(null);

  const showToast = (text) => {
    setToast({ show: true, text });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ show: false, text: "" }), 2000);
  };

  // Replace with real API:
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // DEMO DATA (replace with API response)
        await new Promise((r) => setTimeout(r, 300));
        setLetter({
          companyName: "EconoTech",
          companyAddress: "Gulshan, Dhaka",
          companyPhone: "+88019781234567",
          companyEmail: "econotech85@gmail.com",
          letterRefNo: "HR/RL-2026-001",
          issueDate: "2026-01-03",

          candidateName: "Md. Mahmudur Rahman",
          candidateAddress: "House 14, Road 3, Dhaka, Bangladesh",
          candidateEmail: "hrid3740@gmail.com",

          positionTitle: "Backend Developer",
          department: "Software Engineering",
          startDate: "2026-01-15",
          employmentType: "Full-time",
          workLocation: "On-site",
          officeAddress: "Gulshan, Dhaka",
          salaryAmount: "BDT 25,000",
          salaryFrequency: "per month",
          probationPeriod: "3 months",
          workingHours: "Sunday–Thursday, 10:00 AM – 7:00 PM",
          reportingTo: "Frontend Team Lead",

          extraTerms:
            "You are required to comply with the company policies, code of conduct, and confidentiality agreements.",

          hrName: "Abul Kashem",
          hrTitle: "HR Manager",
        });
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        setErr("Failed to load letter.");
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const issueDatePretty = useMemo(() => prettyDate(letter?.issueDate), [letter?.issueDate]);

  //  PDF logic removed
  const fakeDownload = () => {
    if (!letter || loading) return;
    showToast("Download done ");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/*  Toast */}
      {toast.show ? (
        <div className="fixed right-4 top-4 z-50">
          <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-3 shadow-lg">
            
            <div className="text-xs text-slate-600">{toast.text}</div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recruitment Letter</h1>
            <p className="mt-1 text-sm text-slate-600">View your official offer letter.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={fakeDownload}
              disabled={!letter || loading}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {loading ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 w-52 rounded bg-slate-100" />
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-11/12 rounded bg-slate-100" />
              <div className="h-4 w-10/12 rounded bg-slate-100" />
              <div className="h-80 w-full rounded bg-slate-100" />
            </div>
          ) : err ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{err}</div>
          ) : !letter ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              No recruitment letter found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="p-6 sm:p-10">
                <LetterTemplate data={letter} issueDatePretty={issueDatePretty} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function LetterTemplate({ data, issueDatePretty }) {
  return (
    <div className="text-slate-900">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div>
            <div className="text-xl font-extrabold">{data.companyName || "—"}</div>
            <div className="mt-1 whitespace-pre-line text-sm text-slate-700">{data.companyAddress || "—"}</div>
            <div className="mt-1 text-sm text-slate-700">
              {data.companyPhone ? <span>{data.companyPhone}</span> : null}
              {data.companyPhone && data.companyEmail ? <span className="px-2">•</span> : null}
              {data.companyEmail ? <span>{data.companyEmail}</span> : null}
            </div>
          </div>

          <div className="mt-2 sm:mt-0 text-sm">
            <div className="text-slate-700">
              <span className="font-semibold text-slate-900">Ref:</span> {data.letterRefNo || "—"}
            </div>
            <div className="text-slate-700">
              <span className="font-semibold text-slate-900">Date:</span> {issueDatePretty || "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-lg font-extrabold uppercase tracking-wide">Recruitment Letter</div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="text-sm font-bold">To,</div>
          <div className="mt-1 text-sm font-semibold">{data.candidateName || "Job Seeker Name"}</div>
          <div className="mt-1 whitespace-pre-line text-sm text-slate-700">{data.candidateAddress || "—"}</div>
          <div className="mt-1 text-sm text-slate-700">{data.candidateEmail || ""}</div>
        </div>
        <div className="sm:text-right">
          <div className="text-sm font-bold">Office Location</div>
          <div className="mt-1 whitespace-pre-line text-sm text-slate-700">{data.officeAddress || "—"}</div>
        </div>
      </div>

      <div className="mt-6 space-y-4 text-sm leading-6 text-slate-800">
        <p>
          Dear <span className="font-semibold">{data.candidateName || "Job Seeker"}</span>,
        </p>

        <p>
          We are pleased to offer you the position of{" "}
          <span className="font-semibold">{data.positionTitle || "—"}</span> in the{" "}
          <span className="font-semibold">{data.department || "—"}</span> department at{" "}
          <span className="font-semibold">{data.companyName || "our company"}</span>.
        </p>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <InfoRow label="Position" value={data.positionTitle} />
            <InfoRow label="Department" value={data.department} />
            <InfoRow label="Employment Type" value={data.employmentType} />
            <InfoRow label="Work Location" value={data.workLocation} />
            <InfoRow label="Start Date" value={prettyDate(data.startDate)} />
            <InfoRow label="Reporting To" value={data.reportingTo} />
            <InfoRow label="Salary" value={`${data.salaryAmount || "—"} ${data.salaryFrequency || ""}`} />
            <InfoRow label="Probation" value={data.probationPeriod} />
            <div className="sm:col-span-2">
              <InfoRow label="Working Hours" value={data.workingHours} />
            </div>
          </div>
        </div>

        <p className="whitespace-pre-line">{data.extraTerms || ""}</p>

        <p>Please confirm your acceptance of this offer by replying to this email or contacting HR.</p>

        <p>We look forward to welcoming you to our team.</p>
      </div>

      <div className="mt-10">
        <div className="text-sm font-semibold">Sincerely,</div>
        
        <div className="mt-2 text-sm font-bold">{data.hrName || "—"}</div>
        <div className="text-sm text-slate-700">{data.hrTitle || "—"}</div>
        <div className="mt-1 text-sm text-slate-700">{data.companyName || "—"}</div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-xs font-semibold text-slate-600">{label}</div>
      <div className="text-right text-sm font-semibold text-slate-900">{value || "—"}</div>
    </div>
  );
}

/* ---------------- Utils ---------------- */

function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
