// RecruitmentLetter.jsx (ADMIN)


import React, { useMemo, useRef, useState } from "react";

export default function RecruitmentLetter() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  //  toast (no alert)
  const [toast, setToast] = useState({ show: false, text: "" });
  const toastTimerRef = useRef(null);

  const showToast = (text) => {
    setToast({ show: true, text });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast({ show: false, text: "" }), 2000);
  };

  const [data, setData] = useState({
    companyName: "EconoTech",
    companyAddress: "Gulshan, Dhaka",
    companyPhone: "+88019781234567",
    companyEmail: "econotech85@gmail.com",
    letterRefNo: "HR/RL-2026-001",
    issueDate: new Date().toISOString().slice(0, 10),

    candidateName: "",
    candidateAddress: "",
    candidateEmail: "",

    positionTitle: "",
    department: "",
    startDate: "",
    employmentType: "Full-time",
    workLocation: "On-site",
    officeAddress: "Gulshan, Dhaka",
    salaryAmount: "BDT 25000",
    salaryFrequency: "per month",
    probationPeriod: "3 months",
    workingHours: "Sunday–Thursday, 10:00 AM – 7:00 PM",
    reportingTo: "HR Manager",

    extraTerms:
      "You are required to comply with the company policies, code of conduct, and confidentiality agreements.",

    hrName: "Abul Kashem",
    hrTitle: "HR Manager",
  });

  const letterRef = useRef(null);

  const onChange = (key) => (e) => {
    setData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const issueDatePretty = useMemo(() => prettyDate(data.issueDate), [data.issueDate]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 500));
      showToast("Saved ");
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      showToast("Save failed ");
    } finally {
      setSaving(false);
    }
  };

  const handlePublishToJobSeeker = async () => {
    try {
      setPublishing(true);

      if (!data.candidateName?.trim()) {
        showToast("Job Seeker Name required ");
        return;
      }

      await new Promise((r) => setTimeout(r, 400));
      showToast("Sent to Job Seeker ");
    } finally {
      setPublishing(false);
    }
  };

  const handleLoadDemo = async () => {
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      setData((p) => ({
        ...p,
        candidateName: "Md. Mahmudur Rahman",
        candidateAddress: "House 14, Road 3, Dhaka, Bangladesh",
        candidateEmail: "hrid3740@gmail.com",
        positionTitle: "Backend Developer",
        department: "Software Engineering",
        startDate: "2026-01-15",
        salaryAmount: "BDT 25,000",
        reportingTo: "Backend Team Lead",
      }));
      showToast("Demo loaded ");
    } finally {
      setLoading(false);
    }
  };

  // PDF logic removed
  const fakeDownload = () => {
    showToast("Download done ");
  };

  // cleanup toast timer
  React.useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/*  Toast */}
      {toast.show ? (
        <div className="fixed right-4 top-4 z-50">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
           
            <div className="text-xs text-slate-600">{toast.text}</div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Recruitment Letter </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleLoadDemo}
              disabled={loading}
              
            >
              {loading ? "Loading..." : ""}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Letter"}
            </button>

            <button
              onClick={handlePublishToJobSeeker}
              disabled={publishing}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
            >
              {publishing ? "Sending..." : "Send to Job Seeker"}
            </button>

            <button
              onClick={fakeDownload}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* FORM */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Letter Details</h2>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Company Name" value={data.companyName} onChange={onChange("companyName")} />
              <Input label="Company Email" value={data.companyEmail} onChange={onChange("companyEmail")} />
              <Input label="Company Phone" value={data.companyPhone} onChange={onChange("companyPhone")} />
              <Input label="Ref No" value={data.letterRefNo} onChange={onChange("letterRefNo")} />
              <Input label="Issue Date" type="date" value={data.issueDate} onChange={onChange("issueDate")} />
              <Input label="Start Date" type="date" value={data.startDate} onChange={onChange("startDate")} />

              <div className="md:col-span-2">
                <Textarea label="Company Address" value={data.companyAddress} onChange={onChange("companyAddress")} />
              </div>

              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">Job Seeker</h3>
              <Input label="Job Seeker Name" value={data.candidateName} onChange={onChange("candidateName")} />
              <Input label="Job Seeker Email" value={data.candidateEmail} onChange={onChange("candidateEmail")} />
              <div className="md:col-span-2">
                <Textarea
                  label="Job Seeker Address"
                  value={data.candidateAddress}
                  onChange={onChange("candidateAddress")}
                />
              </div>

              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">Job Offer</h3>
              <Input label="Position Title" value={data.positionTitle} onChange={onChange("positionTitle")} />
              <Input label="Department" value={data.department} onChange={onChange("department")} />

              <Select
                label="Employment Type"
                value={data.employmentType}
                onChange={onChange("employmentType")}
                options={["Full-time", "Part-time", "Contract", "Internship"]}
              />
              <Select
                label="Work Location"
                value={data.workLocation}
                onChange={onChange("workLocation")}
                options={["On-site", "Hybrid", "Remote"]}
              />

              <Input label="Salary Amount" value={data.salaryAmount} onChange={onChange("salaryAmount")} />
              <Select
                label="Salary Frequency"
                value={data.salaryFrequency}
                onChange={onChange("salaryFrequency")}
                options={["per month", "per year", "per day", "per hour"]}
              />

              <Input label="Probation Period" value={data.probationPeriod} onChange={onChange("probationPeriod")} />
              <Input label="Working Hours" value={data.workingHours} onChange={onChange("workingHours")} />

              <Input label="Reporting To" value={data.reportingTo} onChange={onChange("reportingTo")} />
              <div className="md:col-span-2">
                <Textarea label="Office Address" value={data.officeAddress} onChange={onChange("officeAddress")} />
              </div>

              <div className="md:col-span-2">
                <Textarea label="Additional Terms" value={data.extraTerms} onChange={onChange("extraTerms")} rows={6} />
              </div>

              <h3 className="mt-2 md:col-span-2 text-sm font-bold text-slate-900">HR</h3>
              <Input label="HR Name" value={data.hrName} onChange={onChange("hrName")} />
              <Input label="HR Title" value={data.hrTitle} onChange={onChange("hrTitle")} />
            </div>
          </div>

          {/* PREVIEW */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-bold text-slate-900">Preview</h2>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div ref={letterRef} className="p-6 sm:p-8">
                <LetterTemplate data={data} issueDatePretty={issueDatePretty} />
              </div>
            </div>
          </div>
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

function Input({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <textarea
        rows={rows}
        value={value}
        onChange={onChange}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-semibold text-slate-700">{label}</div>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-400"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------------- Utils ---------------- */

function prettyDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}
